const express = require("express");
const controllers = {
  reservas: require("../../controllers/user/reservas.controllers"),
};
const middlewares = {
  auth: require("../../middlewares/auth/auth.middlewares"),
};

const router = express.Router();

router.use(middlewares.auth.protect);

router.get("/", controllers.reservas.list);
router.post("/", controllers.reservas.create);
router.patch("/:id", controllers.reservas.update);
router.delete("/:id", controllers.reservas.remove);

module.exports = router;
