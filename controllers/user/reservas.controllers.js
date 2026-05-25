const catchAsync = require("../../utils/catchAsync.util");
const Accounts = require("../../models/accounts.models");
const { Gimnasio } = require("../../models/gimnasios.models");
const { Reserva } = require("../../models/reservas.models");
const AppError = require("../../utils/app.error.util");
const sendReservaConfirmacion = require("../../mail/reserva.mail");

const RESERVA_INCLUDE = [
  { model: Gimnasio, as: "gimnasio", attributes: ["id", "idrd_id", "code", "park", "locality", "address"] },
  {
    model: Accounts.Address,
    as: "address",
    attributes: ["id", "via_number", "via_bis", "via_quadrant", "cross_number", "cross_quadrant", "plate", "complement", "label", "city", "department"],
    include: [{ model: Accounts.ViaType, as: "viaType", attributes: ["code", "name"] }],
  },
];

function addOneHour(timeStr) {
  const [h, m, s] = timeStr.split(":");
  const next = (parseInt(h, 10) + 1) % 24;
  return `${String(next).padStart(2, "0")}:${m ?? "00"}:${s ?? "00"}`;
}

function validateFields({ gimnasio_id, reservation_date, start_time }, next) {
  if (!gimnasio_id) return next(new AppError("El gimnasio es requerido", 406));
  if (!reservation_date) return next(new AppError("La fecha de reserva es requerida", 406));
  if (!start_time) return next(new AppError("La hora de inicio es requerida", 406));

  const [, m] = start_time.split(":");
  if (m !== "00") return next(new AppError("Solo se permiten horas completas", 406));

  return null;
}

exports.list = catchAsync(async (req, res) => {
  const { sessionAccount } = req;

  const reservas = await Reserva.findAll({
    where: { account_id: sessionAccount.id },
    include: RESERVA_INCLUDE,
    order: [
      ["reservation_date", "DESC"],
      ["start_time", "DESC"],
    ],
  });

  return res.status(200).json(reservas);
});

exports.create = catchAsync(async (req, res, next) => {
  const { sessionAccount } = req;
  const { gimnasio_id, address_id = null, reservation_date, start_time } = req.body;

  const validationError = validateFields({ gimnasio_id, reservation_date, start_time }, next);
  if (validationError !== null) return;

  const gimnasio = await Gimnasio.findByPk(gimnasio_id);
  if (!gimnasio) return next(new AppError("Gimnasio no encontrado", 404));

  if (address_id) {
    const address = await Accounts.Address.findOne({ where: { id: address_id, account_id: sessionAccount.id } });
    if (!address) return next(new AppError("Dirección no encontrada", 404));
  }

  const reserva = await Reserva.create({
    account_id: sessionAccount.id,
    gimnasio_id,
    address_id: address_id || null,
    reservation_date,
    start_time,
    end_time: addOneHour(start_time),
  });

  const full = await Reserva.findByPk(reserva.id, { include: RESERVA_INCLUDE });

  sendReservaConfirmacion(sessionAccount, full).catch(() => {});

  return res.status(201).json({ status: "success", reserva: full });
});

exports.update = catchAsync(async (req, res, next) => {
  const { sessionAccount } = req;
  const { id } = req.params;
  const { gimnasio_id, address_id = null, reservation_date, start_time } = req.body;

  const reserva = await Reserva.findOne({ where: { id, account_id: sessionAccount.id } });
  if (!reserva) return next(new AppError("Reserva no encontrada", 404));

  const validationError = validateFields({ gimnasio_id, reservation_date, start_time }, next);
  if (validationError !== null) return;

  const gimnasio = await Gimnasio.findByPk(gimnasio_id);
  if (!gimnasio) return next(new AppError("Gimnasio no encontrado", 404));

  if (address_id) {
    const address = await Accounts.Address.findOne({ where: { id: address_id, account_id: sessionAccount.id } });
    if (!address) return next(new AppError("Dirección no encontrada", 404));
  }

  await reserva.update({
    gimnasio_id,
    address_id: address_id || null,
    reservation_date,
    start_time,
    end_time: addOneHour(start_time),
  });

  const full = await Reserva.findByPk(reserva.id, { include: RESERVA_INCLUDE });
  return res.status(200).json({ status: "success", reserva: full });
});

exports.remove = catchAsync(async (req, res, next) => {
  const { sessionAccount } = req;
  const { id } = req.params;

  const reserva = await Reserva.findOne({ where: { id, account_id: sessionAccount.id } });
  if (!reserva) return next(new AppError("Reserva no encontrada", 404));

  await reserva.destroy();
  return res.status(200).json({ status: "success", message: "Reserva eliminada" });
});
