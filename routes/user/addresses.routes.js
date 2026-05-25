const express = require("express");
const controllers = {
  addresses: require("../../controllers/user/addresses.controllers"),
};
const middlewares = {
  auth: require("../../middlewares/auth/auth.middlewares"),
};

const router = express.Router();

router.use(middlewares.auth.protect);

router.get("/", controllers.addresses.list);
router.post("/", controllers.addresses.create);
router.patch("/:id/default", controllers.addresses.setDefault);
router.patch("/:id", controllers.addresses.update);
router.delete("/:id", controllers.addresses.remove);

module.exports = router;
