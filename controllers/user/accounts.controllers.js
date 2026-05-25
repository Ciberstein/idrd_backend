const catchAsync = require("../../utils/catchAsync.util");
const Accounts = require("../../models/accounts.models");
const AppError = require("../../utils/app.error.util");
const { isEmailValid } = require("../../utils/validators.util");

exports.data = catchAsync(async (req, res) => {
  const { sessionAccount } = req;

  const account = await Accounts.Account.findOne({
    where: { id: sessionAccount.id },
    attributes: ["id", "authority", "first_name", "middle_name", "last_name1", "last_name2", "birth_date", "doc_number", "email", "phone", "createdAt"],
    include: [{ model: Accounts.DocType, as: 'docType', attributes: ['code', 'name'] }],
  });

  return res.status(200).json({
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
    createdAt: account.createdAt,
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { sessionAccount } = req;
  const { first_name, middle_name, last_name1, last_name2, birth_date, doc_type, doc_number, phone } = req.body;

  if (!first_name || !first_name.trim())
    return next(new AppError("First name cannot be empty", 406));

  if (!last_name1 || !last_name1.trim())
    return next(new AppError("First last name cannot be empty", 406));

  if (!birth_date)
    return next(new AppError("Birth date cannot be empty", 406));

  if (isNaN(Date.parse(birth_date)))
    return next(new AppError("Birth date must be a valid date", 406));

  if (new Date(birth_date) >= new Date())
    return next(new AppError("Birth date must be in the past", 406));

  if (!doc_type || !doc_type.trim())
    return next(new AppError("Document type is required", 406));

  if (!doc_number || !doc_number.trim())
    return next(new AppError("Document number cannot be empty", 406));

  const docTypeRecord = await Accounts.DocType.findOne({ where: { code: doc_type } });
  if (!docTypeRecord)
    return next(new AppError("Invalid document type", 406));

  const existing = await Accounts.Account.findOne({
    where: { doc_number: doc_number.trim() },
  });
  if (existing && existing.id !== sessionAccount.id)
    return next(new AppError("This document number is already registered", 406));

  await sessionAccount.update({
    first_name: first_name.trim(),
    middle_name: middle_name ? middle_name.trim() : null,
    last_name1: last_name1.trim(),
    last_name2: last_name2 ? last_name2.trim() : null,
    birth_date,
    doc_type_id: docTypeRecord.id,
    doc_number: doc_number.trim(),
    phone: phone ? phone.trim() : null,
  });

  return res.status(200).json({
    status: "success",
    message: "Profile updated",
    account: {
      id: sessionAccount.id,
      first_name: sessionAccount.first_name,
      middle_name: sessionAccount.middle_name,
      last_name1: sessionAccount.last_name1,
      last_name2: sessionAccount.last_name2,
      birth_date: sessionAccount.birth_date,
      doc_type: docTypeRecord.code,
      doc_number: doc_number.trim(),
      email: sessionAccount.email,
      phone: phone ? phone.trim() : null,
    },
  });
});
