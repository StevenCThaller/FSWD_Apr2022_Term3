import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import keys from "./config/keys";
import router from "./routes";
import { requestLogger, errorHandler } from "./middleware";
import seedDatabase from "./seedDatabase";

const createError = require("http-errors");

mongoose.connect(keys.database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB");
  seedDatabase();
});

mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

const app = express();

// middleware
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(requestLogger);

// api router
app.use(keys.app.apiEndpoint, router);

app.get("/hello/:name", (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(422).json({ error: "No name given." });
  }

  res.json({ message: `Hello, ${name}!` });
});

app
  .route("/teapot")
  .get((req, res) => res.status(418).json({ message: true }))
  .post((req, res) => {
    const { areYouATeapot } = req.body;

    if (areYouATeapot === true) {
      res.status(418).json({ amIATeapot: "yes" });
    } else if (areYouATeapot === false) {
      res.status(200).json({ amIATeapot: "no" });
    } else {
      res.status(422).json({ error: "Invalid Body" });
    }
  });

app.get("/add/:x/:y", (req, res) => {
  const { x, y } = req.params;

  if (isNaN(x) || isNaN(y)) {
    return res.status(422).json({ error: "x and y must both be numbers" });
  }

  res.json({ sum: Number(x) + Number(y) });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.all("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "NotFound"));
});

// error handler
app.use(errorHandler);

module.exports = app;
