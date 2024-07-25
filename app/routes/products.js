const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests in products route",
  });
});

router.post("/", (req, res, next) => {

    const product = {
        pName : req.body.pName,
        price : req.body.price
    };

  res.status(201).json({
    message: "Handling POST requests in products route",
    createdProduct: product
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;

  if (id === "101") {
    res.status(200).json({
      message: "You discovered the special ID",
      id,
    });
  } else {
    res.status(200).json({
      message: "You passed an ID",
      id,
    });
  }
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;

  res.status(200).json({
    message: "You updated the ID",
    id,
  });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;

  res.status(200).json({
    message: "You deleted the ID",
    id,
  });
});

module.exports = router;
