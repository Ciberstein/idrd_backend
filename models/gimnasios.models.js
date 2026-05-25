const { DataTypes } = require("sequelize");
const { db } = require("../database/config");

const Gimnasio = db.define(
  "gimnasios",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    idrd_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "idrd_id",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "address",
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "code",
    },
    park: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "park",
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "locality",
    },
    upz: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "upz",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description",
    },
  },
  {
    tableName: "gimnasios",
    schema: "app",
  }
);

module.exports = { Gimnasio };
