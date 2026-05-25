// UTILS //
const AppError = require("../../utils/app.error.util");
const catchAsync = require("../../utils/catchAsync.util");

// MODELS //
const Accounts = require("../../models/accounts.models");
const { generateJWT } = require("../../utils/jwt.util");
const { isEmailValid } = require("../../utils/validators.util");
const app_config = require("../../utils/app.config.util");
const hash = require("../../utils/hash.util");


exports.by_username = catchAsync(async (req, _, next) => {
  const { username } = req.body;

  const account = await Accounts.Account.findOne({
    where: { username: username.trim() },
  });

  if(!account) {
    return next(new AppError(`Account with username: ${username.trim()} not found`, 404));
  }

  req.account = account;

  next();
});

exports.by_email = catchAsync(async (req, _, next) => {
  const { email, email_new = null } = req.body;

  const account = await Accounts.Account.findOne({
    where: { email: email.trim().toLowerCase() },
    include: [{ model: Accounts.DocType, as: 'docType', attributes: ['code', 'name'] }],
  });

  if(!account) {
    return next(new AppError(`Account with email: ${email.trim().toLowerCase()} not found`, 404));
  }

  req.email = email_new || account.email;
  req.account = account;

  next();
});


exports.verified = catchAsync(async (req, res, next) => {
  const { account } = req;

  if (account.authority === -1) {
    return next(new AppError('Tu cuenta ha sido suspendida', 403));
  }

  if (account.authority >= 1) {
    const maintenance = await app_config('maintenance_mode');
    if (maintenance && account.authority < 100) {
      return next(new AppError('El sitio está en mantenimiento', 406));
    }

    const token = await generateJWT(account.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.status(200).json({
      status: "success",
      message: "Account has been logged",
      token,
      account: {
        id: account.id,
        first_name: account.first_name,
        middle_name: account.middle_name,
        last_name1: account.last_name1,
        last_name2: account.last_name2,
        birth_date: account.birth_date,
        doc_type: account.docType?.code ?? null,
        doc_number: account.doc_number,
        email: account.email,
        phone: account.phone ?? null,
      },
    });
  }

  // authority === 0: not verified, continue to 2FA
  next();
});

exports.recovery = catchAsync(async (req, _, next) => {
  const { email } = req.body;

  if(!email) {
    return next(new AppError(`Email is required`, 406));
  }

  if(!isEmailValid(email)) {
    return next(new AppError(`Valid email is required`, 406));
  }

  next();
});

exports.recovery_validation = catchAsync(async (req, _, next) => {
  const { accountId, code, password, password_repeat } = req.body;

  if(!accountId) {
    return next(new AppError(`Account ID is required`, 406));
  }

  if(!Number.isInteger(Number(accountId))) {
    return next(new AppError(`Account ID must be a valid integer`, 406));
  }

  if(!code) {
    return next(new AppError(`Security Code is required`, 406));
  }

  if(!Number.isInteger(Number(code))) {
    return next(new AppError(`Security Code must be a valid integer`, 406));
  }

  if(!password) {
    return next(new AppError(`Password cannot be empty`, 406));
  }

  if(password.length < 8) {
    return next(new AppError(`The password must have at least 8 characters`, 406));
  }

  if (password !== password_repeat) {
    return next(new AppError("Passwords do not match", 406));
  }

  next();
});

exports.refresh = catchAsync(async (req, _, next) => {
  const { cookies } = req;

  if (!cookies.token) {
    next(new AppError("Missing token", 400));
  }

  next();
});

exports.update_email = catchAsync(async (req, _, next) => {
  const { email_new, email_new_repeat } = req.body;
  const { sessionAccount } = req;

  if(!email_new) {
    return next(new AppError(`Email new cannot be empty`, 406));
  }

  if(!isEmailValid(email_new)) {
    return next(new AppError(`Valid email is required`, 406));
  }

  if(email_new !== email_new_repeat) {
    return next(new AppError(`Emails do not match`, 406));
  }
  
  if(email_new.toLowerCase() == sessionAccount.email) {
    return next(new AppError(`The email must be different from the current email`, 406));
  }

  const account = await Accounts.Account.findOne({
    where: { email: email_new.toLowerCase(), },
  });

  if (account) {
    return next(new AppError("Email already registered", 406));
  }

  req.email = email_new;
  req.account = sessionAccount;

  next();
});

exports.update_email_validation = catchAsync(async (req, _, next) => {
  const { code, email } = req.body;
  const { sessionAccount } = req;

  if(!email) {
    return next(new AppError(`Email new cannot be empty`, 406));
  }

  if(!isEmailValid(email)) {
    return next(new AppError(`Valid email is required`, 406));
  }

  if(!code) {
    return next(new AppError(`Security Code is required`, 406));
  }

  if(!Number.isInteger(Number(code))) {
    return next(new AppError(`Security Code must be a valid integer`, 406));
  }

  req.body.accountId = sessionAccount.id

  next();
});

exports.update_password = catchAsync(async (req, _, next) => {
  const { password, new_password, new_password_repeat } = req.body;
  const { sessionAccount } = req;

  if(!password) {
    return next(new AppError(`Password cannot be empty`, 406));
  }

  if(hash(password) !== sessionAccount.password) {
    return next(new AppError(`Password incorrect`, 406));
  }

  if(!new_password) {
    return next(new AppError(`New password cannot be empty`, 406));
  }

  if(new_password.length < 8) {
    return next(new AppError(`The new password must have at least 8 characters`, 406));
  }

  if (new_password !== new_password_repeat) {
    return next(new AppError("New passwords do not match", 406));
  }

  req.account = sessionAccount;

  next();
});

exports.update_password_validation = catchAsync(async (req, _, next) => {
  const { sessionAccount } = req;
  const { code, password } = req.body;
  
  if(!password) {
    return next(new AppError(`Password cannot be empty`, 406));
  }

  if(password < 8) {
    return next(new AppError(`The new password must have at least 8 characters`, 406));
  }

  if(!code) {
    return next(new AppError(`Security Code is required`, 406));
  }

  if(!Number.isInteger(Number(code))) {
    return next(new AppError(`Security Code must be a valid integer`, 406));
  }

  req.body.accountId = sessionAccount.id

  next();
});