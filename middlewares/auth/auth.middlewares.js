
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

// MODELS
const Accounts = require("../../models/accounts.models");
const Auth = require("../../models/auth.models");

// UTILS
const mail = require("../../mail");
const code = require("../../utils/code.util");
const formatTime = require("../../utils/format.time.util");
const catchAsync = require("../../utils/catchAsync.util");
const AppError = require("../../utils/app.error.util");
const { isEmailValid } = require("../../utils/validators.util");
const App = require("../../models/app.models");


exports.protect = catchAsync(async (req, _, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please login to get access', 401)
    );
  }

  let decoded;

  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_SEED);
  } catch (error) {
    return next(
      new AppError('Invalid token. Please login again', 401)
    );
  }

  const account = await Accounts.Account.findOne({
    where: { id: decoded.id },
  });

  if (!account) {
    return next(
      new AppError('The owner of this account is no longer available', 406)
    );
  }

  req.sessionAccount = account;
  next();
});

exports.protectOwner = catchAsync(async (req, _, next) => {
  const { account, sessionAccount } = req;

  if (account.Id !== sessionAccount.id)
    next(new AppError("You do not own of this account", 401));

  next();
});

exports.restrict = (...roles) => catchAsync(async (req, _, next) => {

  if (!roles.includes(req.sessionAccount.authority)) {
    return next(new AppError("Insufficient allowance", 406));
  }

  next();
});

exports.code_generate = catchAsync(async (req, _, next) => {
  let code_new;
  let code_exist;

  do {
    code_new = code().toString();

    code_exist = await Auth.Codes.findOne({
      where: { code: code_new },
    });
  } while (code_exist);

  req.code = code_new;

  next();
});

exports.user_has_code = catchAsync(async (req, _, next) => {
  const { account, code, email = null } = req;

  const query = await Auth.Codes.findOne({
    where: { accountId: account.id },
  });

  if (query) {
    const now = new Date();
    const dif = (now - query.updatedAt) / 1000;
    const limit = process.env.MAIL_SEND_LIMIT;

    if (dif < limit) {
      return next(
        new AppError(
          `You must wait a few seconds before generating another code`,
          406
        )
      );
    }

    await query.update({ code });

  } else {
    await Auth.Codes.create({
      code,
      accountId: account.id,
    });
  }

  req.email = email || account.email;

  next();
});

exports.code_send = catchAsync(async (req, _, next) => {
  const { email, code } = req;

  const sender = await App.Config.findOne({
    where: { key: 'project_name' }
  });


  const body = `Hello, <br />Here you have a temporary security code for your account. 
    It can only be used once within the next ${formatTime(
      process.env.MAIL_CODE_EXPIRE * 1000
    )}, after which it will expire:<br /><br />
    <b>${code}</b><br /><br />Did you receive this email without having an active request to enter a verification code? 
    If so, the security of your account may be compromised. Please change your password as soon as possible.`;

  req.mail = await mail(
    email,
    "Security code",
    body,
    sender.value
  );

  next();
});

exports.code_exist = catchAsync(async (req, _, next) => {
  const { code, accountId } = req.body;

  const code_exist = await Auth.Codes.findOne({
    where: { code, accountId },
    include: [{ model: Accounts.Account, as: 'account' }],
  });

  if (!code_exist) {
    return next(new AppError("Invalid code", 406));
  }
  
  req.code = code_exist;

  next();
});

exports.code_expired = catchAsync(async (req, _, next) => {
  const { code } = req;

  const limit = process.env.CODE_EXPIRE_IN * 1000;
  const now = new Date();
  const dif = now - code.updatedAt;

  if (dif > limit) {
    next(new AppError("Code expired", 401));
  }

  next();
});

exports.code_delete = catchAsync(async (req, _, next) => {
  const { code } = req;

  await code.destroy();

  next();
});

exports.code_validation = catchAsync(async (req, _, next) => {
  const { email, email_new = null } = req.body;

  if(!email) {
    return next(new AppError(`Email is required`, 406));
  }

  if(!isEmailValid(email)) {
    return next(new AppError(`Valid email is required`, 406));
  }

  if(email_new && !isEmailValid(email_new)) {
    return next(new AppError(`Valid new email is required`, 406));
  }

  next();
});