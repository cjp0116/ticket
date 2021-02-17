const express = require("express");
const app = express();
const ExpressError = require("./ExpressError");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);

app.use((req, res, next) => {
  const error = new ExpressError('Page not found', 404);
  return next(error)
});

app.use((err, req, res, next) => {
  let msg = err.msg || "Something went wrong";
  let statusCode = err.statusCode || 500;
  return res.status(statusCode).json({ error : { msg, statusCode }})
});


module.exports = app;