// MODELS
const Accounts = require("../../models/accounts.models");

// UTILS
const { isEmailValid } = require("../../utils/validators.util");
const hash = require("../../utils/hash.util");
const AppError = require("../../utils/app.error.util");
const catchAsync = require("../../utils/catchAsync.util");
const app_config = require("../../utils/app.config.util");

exports.validate = catchAsync(async (req, _, next) => {
  const { first_name, last_name1, birth_date, doc_type, doc_number, email, password, password_repeat } = req.body;

  const status = await app_config('register_status');

  if (status === false) {
    return next(new AppError(`Register is not available at this moment`, 406));
  }

  if (!doc_type || !doc_type.trim()) {
    return next(new AppError(`Document type is required`, 406));
  }

  if (!doc_number || !doc_number.trim()) {
    return next(new AppError(`Document number cannot be empty`, 406));
  }

  if (!first_name || !first_name.trim()) {
    return next(new AppError(`First name cannot be empty`, 406));
  }

  if (!last_name1 || !last_name1.trim()) {
    return next(new AppError(`First last name cannot be empty`, 406));
  }

  if (!birth_date) {
    return next(new AppError(`Birth date cannot be empty`, 406));
  }

  if (isNaN(Date.parse(birth_date))) {
    return next(new AppError(`Birth date must be a valid date`, 406));
  }

  if (new Date(birth_date) >= new Date()) {
    return next(new AppError(`Birth date must be in the past`, 406));
  }

  if (!email || !email.trim()) {
    return next(new AppError(`Email cannot be empty`, 406));
  }

  if (!isEmailValid(email)) {
    return next(new AppError(`A valid email is required`, 406));
  }

  if (!password) {
    return next(new AppError(`Password cannot be empty`, 406));
  }

  if (password.length < 8) {
    return next(new AppError(`The password must have at least 8 characters`, 406));
  }

  if (password !== password_repeat) {
    return next(new AppError(`Passwords do not match`, 406));
  }

  next();
});

exports.validation = catchAsync(async (req, _, next) => {
  const { accountId, code } = req.body;

  if (!accountId) {
    return next(new AppError(`Account ID is required`, 406));
  }

  if (!Number.isInteger(Number(accountId))) {
    return next(new AppError(`Account ID must be a valid integer`, 406));
  }

  if (!code) {
    return next(new AppError(`Security Code is required`, 406));
  }

  if (!Number.isInteger(Number(code))) {
    return next(new AppError(`Security Code must be a valid integer`, 406));
  }

  next();
});

exports.account = catchAsync(async (req, _, next) => {
  const { email, doc_number } = req.body;

  const acc_email = await Accounts.Account.findOne({
    where: { email: email.toLowerCase() },
  });

  if (acc_email) {
    return next(new AppError("This email is already registered", 406));
  }

  const acc_doc = await Accounts.Account.findOne({
    where: { doc_number: doc_number.trim() },
  });

  if (acc_doc) {
    return next(new AppError("This document number is already registered", 406));
  }

  next();
});

exports.create = catchAsync(async (req, res, next) => {
  const {
    first_name,
    middle_name = null,
    last_name1,
    last_name2 = null,
    birth_date,
    doc_type,
    doc_number,
    email,
    password,
    email_verified = false,
  } = req.body;

  const docTypeRecord = await Accounts.DocType.findOne({ where: { code: doc_type } });

  if (!docTypeRecord) {
    return next(new AppError("Invalid document type", 406));
  }

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const account = await Accounts.Account.create({
    authority: email_verified ? 0 : -1,
    ip,
    first_name: first_name.trim(),
    middle_name: middle_name ? middle_name.trim() : null,
    last_name1: last_name1.trim(),
    last_name2: last_name2 ? last_name2.trim() : null,
    birth_date,
    doc_type_id: docTypeRecord.id,
    doc_number: doc_number.trim(),
    password: hash(password),
    email: email.toLowerCase(),
  });

  if (!account) {
    return next(new AppError("Error on register", 500));
  }

  if (email_verified) {
    return res.status(201).json({
      status: "success",
      message: "Account has been created",
      account: {
        id: account.id,
        first_name: account.first_name,
        last_name1: account.last_name1,
        email: account.email,
      },
    });
  }

  req.account = account;

  next();
});
