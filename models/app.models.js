const { db } = require("../database/config");
const { DataTypes } = require("sequelize");

const Category = db.define(
  "app_config_categories", 
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "name",
    },
  }, 
  {
    schema: "app",
    tableName: "app_config_categories"
  }
);

const Config = db.define(
  "app_config",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id",
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "key",
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "value",
    },
    data_type: {
      type: DataTypes.ENUM("boolean", "string", "number", "json", "array"),
      allowNull: false,
      field: "data_type",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "categoryId"
    },
  },
  {
    tableName: "app_config",
    schema: "app",
  }
);

const App = {
  Category,
  Config
}

module.exports = App;
