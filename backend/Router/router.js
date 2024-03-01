require("dotenv").config();
require("../Database/database");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();
const auth = require("./auth");
const Channel = require("./channel");
const Videos = require("./videos");
const Likes = require("./likes");
const Comments = require("./comments");
const Studio = require("./studio");
const app = express();

// Use CORS middleware for the entire app
app.use(cors());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth);
app.use(Channel);
app.use(Videos);
app.use(Likes);
app.use(Comments);
app.use(Studio);

router.get("/", (req, res) => {
  res.send("Welcome to HOLE VIDEOS Backend!");
});

module.exports = app;
