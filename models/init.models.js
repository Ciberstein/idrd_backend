const Accounts = require("./accounts.models");
const App = require("./app.models");
const Auth = require("./auth.models");
const { Gimnasio } = require("./gimnasios.models");
const { Reserva } = require("./reservas.models");


const init = () => {

  /* APP RELATIONSHIPS */

  App.Config.belongsTo(App.Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });
  App.Category.hasMany(App.Config, {
    foreignKey: 'categoryId',
    as: 'items'
  });

  /* END APP RELATIONSHIPS */

  /* ACCOUNTS RELATIONSHIPS */

  Accounts.DocType.hasMany(Accounts.Account, {
    foreignKey: 'doc_type_id',
    as: 'accounts',
  });
  Accounts.Account.belongsTo(Accounts.DocType, {
    foreignKey: 'doc_type_id',
    as: 'docType',
  });

  Accounts.Account.hasMany(Auth.Codes, {
    onDelete: 'CASCADE',
    foreignKey: 'accountId',
    as: 'codes',
  });
  Auth.Codes.belongsTo(Accounts.Account, {
    foreignKey: 'accountId',
    as: 'account',
  });

  Accounts.ViaType.hasMany(Accounts.Address, {
    foreignKey: 'via_type_id',
    as: 'addresses',
  });
  Accounts.Address.belongsTo(Accounts.ViaType, {
    foreignKey: 'via_type_id',
    as: 'viaType',
  });

  Accounts.Account.hasMany(Accounts.Address, {
    onDelete: 'CASCADE',
    foreignKey: 'account_id',
    as: 'addresses',
  });
  Accounts.Address.belongsTo(Accounts.Account, {
    foreignKey: 'account_id',
    as: 'account',
  });

  /* END ACCOUNTS RELATIONSHIPS */

  /* RESERVAS RELATIONSHIPS */

  Accounts.Account.hasMany(Reserva, {
    onDelete: 'CASCADE',
    foreignKey: 'account_id',
    as: 'reservas',
  });
  Reserva.belongsTo(Accounts.Account, {
    foreignKey: 'account_id',
    as: 'account',
  });

  Gimnasio.hasMany(Reserva, {
    onDelete: 'CASCADE',
    foreignKey: 'gimnasio_id',
    as: 'reservas',
  });
  Reserva.belongsTo(Gimnasio, {
    foreignKey: 'gimnasio_id',
    as: 'gimnasio',
  });

  Accounts.Address.hasMany(Reserva, {
    onDelete: 'SET NULL',
    foreignKey: 'address_id',
    as: 'reservas',
  });
  Reserva.belongsTo(Accounts.Address, {
    foreignKey: 'address_id',
    as: 'address',
  });

  /* END RESERVAS RELATIONSHIPS */
}

module.exports = init;