const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const db_name = encodeURIComponent(process.env.MONGO_DB);
const uri = `mongodb+srv://${username}:${password}@cluster0.jcetwuv.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri);
// .then(() => {
//   app.listen(3000);
// })
// .catch((err) => {
//   console.log(err);
// });

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // console.log('INSIDE');
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
// app("/", (req, res) => {
//   res.json({ message: "WORKING" });
// });
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
