const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  // res.status(200).json({
  //   message: "Handling GET requests in products route",
  // });
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length >= 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  // const product = {
  //     pName : req.body.pName,
  //     price : req.body.price
  // };

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    pName: req.body.pName,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests in products route",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;

  // if (id === "101") {
  //   res.status(200).json({
  //     message: "You discovered the special ID",
  //     id,
  //   });
  // } else {
  //   res.status(200).json({
  //     message: "You passed an ID",
  //     id,
  //   });
  // }

  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  // res.status(200).json({
  //   message: "You updated the ID",
  //   id,
  // });

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;

  // res.status(200).json({
  //   message: "You deleted the ID",
  //   id,
  // });

  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
