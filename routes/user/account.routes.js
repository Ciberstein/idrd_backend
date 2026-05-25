const express = require("express");

// CONTROLLERS
const controllers = {
  accounts: require("../../controllers/user/accounts.controllers"),
};

// MIDDLEWARES
const middlewares = {
  auth: require("../../middlewares/auth/auth.middlewares"),
};

const router = express.Router();

router.use(middlewares.auth.protect);

router.get("/", controllers.accounts.data);

router.patch("/profile", controllers.accounts.updateProfile);

module.exports = router;
