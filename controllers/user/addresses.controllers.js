const catchAsync = require("../../utils/catchAsync.util");
const Accounts = require("../../models/accounts.models");
const AppError = require("../../utils/app.error.util");

const QUADRANTS = ["Norte", "Sur", "Este", "Oeste"];

function validateFields({ via_type, via_number, cross_number, plate, via_quadrant, cross_quadrant, city, department }, next) {
  if (!city || !city.trim())
    return next(new AppError("La ciudad es requerida", 406));
  if (!department || !department.trim())
    return next(new AppError("El departamento es requerido", 406));
  if (!via_type || !via_type.trim())
    return next(new AppError("El tipo de vía es requerido", 406));
  if (!via_number || !via_number.trim())
    return next(new AppError("El número de vía es requerido", 406));
  if (!cross_number || !cross_number.trim())
    return next(new AppError("El número cruce es requerido", 406));
  if (!plate || !plate.trim())
    return next(new AppError("La placa es requerida", 406));
  if (via_quadrant && !QUADRANTS.includes(via_quadrant))
    return next(new AppError("Cuadrante de vía inválido", 406));
  if (cross_quadrant && !QUADRANTS.includes(cross_quadrant))
    return next(new AppError("Cuadrante de cruce inválido", 406));
  return null;
}

exports.list = catchAsync(async (req, res) => {
  const { sessionAccount } = req;

  const addresses = await Accounts.Address.findAll({
    where: { account_id: sessionAccount.id },
    include: [{ model: Accounts.ViaType, as: "viaType", attributes: ["code", "name"] }],
    order: [
      ["is_default", "DESC"],
      ["id", "ASC"],
    ],
  });

  return res.status(200).json(addresses);
});

exports.create = catchAsync(async (req, res, next) => {
  const { sessionAccount } = req;
  const {
    via_type, via_number, via_bis = false, via_quadrant = null,
    cross_number, cross_quadrant = null, plate,
    complement = null, label = null, city = null, department = null, is_default = false,
  } = req.body;

  const validationError = validateFields({ via_type, via_number, cross_number, plate, via_quadrant, cross_quadrant, city, department }, next);
  if (validationError !== null) return;

  const viaTypeRecord = await Accounts.ViaType.findOne({ where: { code: via_type } });
  if (!viaTypeRecord) return next(new AppError("Tipo de vía no encontrado", 406));

  if (is_default) {
    await Accounts.Address.update({ is_default: false }, { where: { account_id: sessionAccount.id } });
  }

  const address = await Accounts.Address.create({
    account_id: sessionAccount.id,
    via_type_id: viaTypeRecord.id,
    via_number: via_number.trim().toUpperCase(),
    via_bis: Boolean(via_bis),
    via_quadrant: via_quadrant || null,
    cross_number: cross_number.trim().toUpperCase(),
    cross_quadrant: cross_quadrant || null,
    plate: plate.trim(),
    complement: complement ? complement.trim() : null,
    label: label ? label.trim() : null,
    city: city ? city.trim() : null,
    department: department ? department.trim() : null,
    is_default: Boolean(is_default),
  });

  return res.status(201).json({
    status: "success",
    address: { ...address.toJSON(), viaType: { code: viaTypeRecord.code, name: viaTypeRecord.name } },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { sessionAccount } = req;
  const { id } = req.params;
  const {
    via_type, via_number, via_bis = false, via_quadrant = null,
    cross_number, cross_quadrant = null, plate,
    complement = null, label = null, city = null, department = null, is_default = false,
  } = req.body;

  const address = await Accounts.Address.findOne({
    where: { id, account_id: sessionAccount.id },
  });
  if (!address) return next(new AppError("Dirección no encontrada", 404));

  const validationError = validateFields({ via_type, via_number, cross_number, plate, via_quadrant, cross_quadrant, city, department }, next);
  if (validationError !== null) return;

  const viaTypeRecord = await Accounts.ViaType.findOne({ where: { code: via_type } });
  if (!viaTypeRecord) return next(new AppError("Tipo de vía no encontrado", 406));

  if (is_default) {
    await Accounts.Address.update({ is_default: false }, { where: { account_id: sessionAccount.id } });
  }

  await address.update({
    via_type_id: viaTypeRecord.id,
    via_number: via_number.trim().toUpperCase(),
    via_bis: Boolean(via_bis),
    via_quadrant: via_quadrant || null,
    cross_number: cross_number.trim().toUpperCase(),
    cross_quadrant: cross_quadrant || null,
    plate: plate.trim(),
    complement: complement ? complement.trim() : null,
    label: label ? label.trim() : null,
    city: city ? city.trim() : null,
    department: department ? department.trim() : null,
    is_default: Boolean(is_default),
  });

  return res.status(200).json({
    status: "success",
    address: { ...address.toJSON(), viaType: { code: viaTypeRecord.code, name: viaTypeRecord.name } },
  });
});

exports.remove = catchAsync(async (req, res, next) => {
  const { sessionAccount } = req;
  const { id } = req.params;

  const address = await Accounts.Address.findOne({
    where: { id, account_id: sessionAccount.id },
  });
  if (!address) return next(new AppError("Dirección no encontrada", 404));

  await address.destroy();

  return res.status(200).json({ status: "success", message: "Dirección eliminada" });
});

exports.setDefault = catchAsync(async (req, res, next) => {
  const { sessionAccount } = req;
  const { id } = req.params;

  const address = await Accounts.Address.findOne({
    where: { id, account_id: sessionAccount.id },
  });
  if (!address) return next(new AppError("Dirección no encontrada", 404));

  await Accounts.Address.update({ is_default: false }, { where: { account_id: sessionAccount.id } });
  await address.update({ is_default: true });

  return res.status(200).json({ status: "success", message: "Dirección principal actualizada" });
});
