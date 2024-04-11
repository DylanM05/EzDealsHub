import "express-async-errors";
import createError from "http-errors";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.router.js";
import path from "path"; //although path is a core module, we need to import it as a module to use it with ES6 import syntax

const app = express();
const CURRENT_WORKING_DIR = process.cwd();
const imageDir = path.join(CURRENT_WORKING_DIR, "uploads/images");
app.use("/images", express.static(imageDir));
app.use(express.static(path.join(CURRENT_WORKING_DIR, "dist/frontend")));

//setup mongoURI with credentials from .env
const mongoURI = `mongodb+srv://${process.env.ATLAS_USR}:${process.env.ATLAS_PWD}@${process.env.ATLAS_SRV}/${process.env.ATLAS_DB}?retryWrites=true&w=majority`;

//connect to MongoDB with mongoose
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.text({ type: "/" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", indexRouter); //if path is / then load index
app.use("/api", apiRouter); //only hit api if path is /api/*
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(CURRENT_WORKING_DIR, "dist/frontend/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // log the error to console
  res.status(err.status || 500).send();
  console.error("error:", err);
});

export default app;
