const { DataTypes } = require("sequelize");
const { db } = require("../database/config");

const Reserva = db.define(
  "reservas",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "account_id",
    },
    gimnasio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "gimnasio_id",
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "address_id",
    },
    reservation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "reservation_date",
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
      field: "start_time",
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
      field: "end_time",
    },
  },
  {
    tableName: "reservas",
    schema: "app",
  }
);

module.exports = { Reserva };
