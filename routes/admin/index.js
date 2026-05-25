const express = require("express");

const controllers = {
  accounts: require("../../controllers/admin/accounts.controllers"),
};

const middlewares = {
  auth: require("../../middlewares/auth/auth.middlewares"),
};

const router = express.Router();

router.use(middlewares.auth.protect);
router.use(middlewares.auth.restrict(1));

router.get("/users", controllers.accounts.list);
router.get("/users/:id", controllers.accounts.getOne);
router.patch("/users/:id", controllers.accounts.update);

module.exports = router;
