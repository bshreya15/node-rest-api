const express = require("express");
const app = express();

//logging package for nodeJS
const morgan = require("morgan");

//body-parser
const bodyParser = require('body-parser');

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const productRoutes = require("./app/routes/products");
const orderRoutes = require("./app/routes/orders");

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);


app.use((req, res, next) => {
  const error = new Error("not found");
  error.status=404;
  next(error);
//   res.status(200).json({
//     message: "It works! \n 1. /products",
//   });
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
