
const { cors: cors_conf } = require('./cors/config');
const cookieParser = require('cookie-parser');
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const http = require('http');
const app = express();

const server = http.createServer(app);
const router = express.Router();

// CONTROLLERS //
const { globalErrorHandler } = require('./controllers/error.controllers');

// ROUTES //
const user = require("./routes/user");
const auth = require("./routes/auth");
const admin = require("./routes/admin");

if (process.env.NODE_ENV === "development") 
  app.use(morgan("dev"));

app.use("/ping", (_, r) => r.send("pong"));
app.use(cors(cors_conf));
app.use(cookieParser()); 
app.use(express.json(
  { verify: (r, _, b) => r.raw = b }
));

router.use("/me", user);
router.use("/auth", auth);
router.use("/admin", admin);

app.use("/api/v1", router);

app.use(globalErrorHandler);

module.exports = { server };