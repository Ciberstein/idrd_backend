const { Op } = require("sequelize");
const catchAsync = require("../../utils/catchAsync.util");
const AppError = require("../../utils/app.error.util");
const Accounts = require("../../models/accounts.models");

const ATTRIBUTES = [
  "id", "authority", "first_name", "middle_name", "last_name1", "last_name2",
  "birth_date", "doc_number", "email", "phone", "createdAt",
];

function fmt(account) {
  return {
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
  };
}

exports.list = catchAsync(async (req, res) => {
  const { q, page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where = q
    ? {
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${q}%` } },
          { last_name1: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
          { doc_number: { [Op.iLike]: `%${q}%` } },
        ],
      }
    : {};

  const { count, rows } = await Accounts.Account.findAndCountAll({
    where,
    attributes: ATTRIBUTES,
    include: [{ model: Accounts.DocType, as: "docType", attributes: ["code", "name"] }],
    limit: Number(limit),
    offset,
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({
    total: count,
    page: Number(page),
    limit: Number(limit),
    users: rows.map(fmt),
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const account = await Accounts.Account.findOne({
    where: { id: req.params.id },
    attributes: ATTRIBUTES,
    include: [{ model: Accounts.DocType, as: "docType", attributes: ["code", "name"] }],
  });

  if (!account) return next(new AppError("Usuario no encontrado", 404));
  return res.status(200).json(fmt(account));
});

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { first_name, middle_name, last_name1, last_name2, birth_date, doc_type, doc_number, phone, authority } = req.body;

  const account = await Accounts.Account.findOne({ where: { id } });
  if (!account) return next(new AppError("Usuario no encontrado", 404));

  const updates = {};

  if (first_name !== undefined) {
    if (!first_name?.trim()) return next(new AppError("El nombre no puede estar vacío", 406));
    updates.first_name = first_name.trim();
  }
  if (last_name1 !== undefined) {
    if (!last_name1?.trim()) return next(new AppError("El primer apellido no puede estar vacío", 406));
    updates.last_name1 = last_name1.trim();
  }
  if (middle_name !== undefined) updates.middle_name = middle_name?.trim() || null;
  if (last_name2 !== undefined) updates.last_name2 = last_name2?.trim() || null;
  if (birth_date !== undefined) updates.birth_date = birth_date;
  if (phone !== undefined) updates.phone = phone?.trim() || null;
  if (authority !== undefined) updates.authority = Number(authority);

  if (doc_type !== undefined) {
    const docTypeRecord = await Accounts.DocType.findOne({ where: { code: doc_type } });
    if (!docTypeRecord) return next(new AppError("Tipo de documento inválido", 406));
    updates.doc_type_id = docTypeRecord.id;
  }

  if (doc_number !== undefined) {
    const existing = await Accounts.Account.findOne({ where: { doc_number: doc_number.trim() } });
    if (existing && existing.id !== account.id)
      return next(new AppError("Este número de documento ya está registrado", 406));
    updates.doc_number = doc_number.trim();
  }

  await account.update(updates);

  const updated = await Accounts.Account.findOne({
    where: { id },
    attributes: ATTRIBUTES,
    include: [{ model: Accounts.DocType, as: "docType", attributes: ["code", "name"] }],
  });

  return res.status(200).json({ status: "success", user: fmt(updated) });
});
