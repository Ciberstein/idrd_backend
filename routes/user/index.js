const express = require("express");

const routes = {
  account: require("./account.routes"),
  addresses: require("./addresses.routes"),
  reservas: require("./reservas.routes"),
};

const router = express.Router();

router.use("/account", routes.account);
router.use("/addresses", routes.addresses);
router.use("/reservas", routes.reservas);

module.exports = router;