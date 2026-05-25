const { DataTypes } = require("sequelize");
const { db } = require("../database/config");

const Codes = db.define(
  "auth_codes",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id",
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "code",
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "accountId",
    },
  },
  {
    tableName: "auth_codes",
    schema: "auth",
  }
);

const Auth = {
  Codes
}

module.exports = Auth;
