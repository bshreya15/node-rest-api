const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests in orders route",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Handling POST requests in orders route",
  });
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "order details!",
    orderId: req.params.orderId,
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "order deleted!",
    orderId: req.params.orderId,
  });
});

module.exports = router;
