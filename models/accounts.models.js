const { DataTypes } = require("sequelize");
const { db } = require("../database/config");

const DocType = db.define(
  "doc_types",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "doc_types",
    schema: "accounts",
    timestamps: false,
  }
);

const Account = db.define(
  "accounts",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "id",
    },
    authority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
      field: "authority",
    },
    lang: {
      type: DataTypes.ENUM("es", "en"),
      allowNull: false,
      defaultValue: "es",
      field: "lang",
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "middle_name",
    },
    last_name1: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name1",
    },
    last_name2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "last_name2",
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "birth_date",
    },
    doc_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "doc_type_id",
    },
    doc_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "doc_number",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "email",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password",
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "ip",
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "phone",
    },
  },
  {
    tableName: "accounts",
    schema: "accounts",
  }
);

const ViaType = db.define(
  "via_types",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "via_types",
    schema: "accounts",
    timestamps: false,
  }
);

const Address = db.define(
  "addresses",
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
    via_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "via_type_id",
    },
    via_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "via_number",
    },
    via_bis: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "via_bis",
    },
    via_quadrant: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "via_quadrant",
    },
    cross_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "cross_number",
    },
    cross_quadrant: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "cross_quadrant",
    },
    plate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "plate",
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "complement",
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "label",
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "city",
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "department",
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_default",
    },
  },
  {
    tableName: "addresses",
    schema: "accounts",
  }
);

const Accounts = {
  Account,
  DocType,
  ViaType,
  Address,
};

module.exports = Accounts;
