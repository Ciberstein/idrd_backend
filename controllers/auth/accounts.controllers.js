const catchAsync = require("../../utils/catchAsync.util");
const Accounts = require("../../models/accounts.models");
const { Gimnasio } = require("../../models/gimnasios.models");
const { generateJWT } = require("../../utils/jwt.util");
const hash = require("../../utils/hash.util");
const jwt = require("jsonwebtoken");

exports.doc_types = catchAsync(async (_, res) => {
  const types = await Accounts.DocType.findAll({
    attributes: ['id', 'code', 'name'],
    order: [['id', 'ASC']],
  });
  return res.status(200).json(types);
});

exports.via_types = catchAsync(async (_, res) => {
  const types = await Accounts.ViaType.findAll({
    attributes: ['id', 'code', 'name'],
    order: [['id', 'ASC']],
  });
  return res.status(200).json(types);
});

exports.gimnasios = catchAsync(async (_, res) => {
  const list = await Gimnasio.findAll({
    attributes: ['id', 'idrd_id', 'code', 'park', 'locality', 'upz', 'address'],
    order: [['idrd_id', 'ASC']],
  });
  return res.status(200).json(list);
});


exports.create = catchAsync(async (req, res) => {
  const { account, mail } = req;

  if (!mail)
    return res.status(500).json({
      status: "error",
      message: "Error on sending security code",
    });

  return res.status(200).json({
    status: "success",
    message: "Account created but is pending for verification",
    account: {
      id: account.id,
      first_name: account.first_name,
      last_name1: account.last_name1,
      email: account.email,
    },
  });
});

exports.validate = catchAsync(async (req, res) => {
  const { code } = req;

  await code.account.update({
    authority: 1,
  });

  return res.status(200).json({
    status: "success",
    message: "Validation completed",
  });
});

exports.login = catchAsync(async (req, res) => {
  const { account } = req;

  return res.status(202).json({
    message: "The account must be validated",
    account: {
      id: account.id,
      first_name: account.first_name,
      last_name1: account.last_name1,
      email: account.email,
    },
  });
});

exports.logout = catchAsync(async (_, res) => {
  res.clearCookie('token');
  return res.send('Logged out');
});

exports.recovery = catchAsync(async (req, res) => {
  const { account } = req;

  return res.status(202).json({
    message: "The recovery code was sent",
    account: {
      id: account.id,
      first_name: account.first_name,
      last_name1: account.last_name1,
      email: account.email,
    },
  });
});

exports.recovery_password = catchAsync(async (req, res) => {
  const { password } = req.body;
  const { code } = req;

  await code.account.update({
    password: hash(password),
  });

  return res.status(200).json({
    status: "success",
    message: "Password reset",
  });

});

exports.code_send = catchAsync(async (req, res) => {
  const { mail } = req;

  if (mail)
    return res.status(200).json({
      status: "success",
      message: "Auth code sent",
    });

  return res.status(500).json({
    status: "error",
    message: "Error on sending code",
  });
});

exports.refresh = catchAsync(async (req, res) => {
  const { cookies } = req;

  const decoded = jwt.decode(cookies.token);

  const token = await generateJWT(decoded.id);
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, 
    sameSite: 'strict',
  });

  return res.status(200).json({
    status: 'success',
    message: 'Token refreshed'
  });
});

exports.validate_session = catchAsync(async (req, res) => {
  const { cookies } = req;

  if (!cookies.token) return res.status(200).json({ auth: false });

  const decoded = jwt.decode(cookies.token);
  if (!decoded?.id) return res.status(200).json({ auth: false });

  const account = await Accounts.Account.findOne({
    where: { id: decoded.id },
    attributes: ["id", "authority", "first_name", "middle_name", "last_name1", "last_name2", "birth_date", "doc_number", "email", "phone", "createdAt"],
    include: [{ model: Accounts.DocType, as: 'docType', attributes: ['code', 'name'] }],
  });

  if (!account) return res.status(200).json({ auth: false });

  return res.status(200).json({
    auth: true,
    user: {
      id: account.id,
      authority: account.authority,
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
});

exports.update_email = catchAsync(async (req, res) => {
  const { email } = req;

  return res.status(200).json({
    status: "success",
    account: { email },
  });
});

exports.update_email_validation = catchAsync(async (req, res) => {
  const { email } = req.body;
  const { sessionAccount } = req;

  await sessionAccount.update({
    email: email.toLowerCase(),
  });

  return res.status(200).json({
    status: "success",
    message: "Email updated",
  });
});

exports.update_password = catchAsync(async (req, res) => {
  const { new_password } = req.body;

  return res.status(200).json({
    status: "success",
    account: {
      new_password,
    },
  });
});

exports.update_password_validation = catchAsync(async (req, res) => {
  const { password } = req.body;
  const { sessionAccount } = req;

  await sessionAccount.update({
    password: hash(password),
  });

  return res.status(200).json({
    status: "success",
    message: "Password updated",
  });
});

exports.data = catchAsync(async (req, res) => {
  const { sessionAccount } = req;

  const account = await Accounts.Account.findOne({
    where: { id: sessionAccount.id },
    attributes: [
      "id",
      "authority",
      "username",
      "email",
      "ip",
      "createdAt",
    ],
  });

  return res.status(200).send(account);
});