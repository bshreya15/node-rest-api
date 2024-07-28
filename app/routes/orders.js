const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
router.get("/", (req, res, next) => {
  // res.status(200).json({
  //   message: "Handling GET requests in orders route",
  // });

  Order.find()
    .select("product quantity _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        description: "Get all orders",
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,

            request: {
              type: "GET",

              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };

      if (docs.length >= 0) {
        // res.status(200).json(docs);
        res.status(200).json(response);
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
  // const order = {
  //     pId : req.body.pId,
  //     quantity : req.body.quantity
  // };

  Product.findById(req.body.productId)
    .then((product) => {
      if(!product){
        return res.status(404).json({
          message:"Product not found"
        })
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
      });
      return order
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message:'Order Stored',
            createdOrder:{
              _id: result._id,
              product: result.product,
              quantity: result.quantity
            },
            request:{
              type: "POST",
              url: "http://localhost:3000/orders/" + result._id,
         
            }
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not found",
        error: err,
      });
    });
  // const order = new Order({
  //   _id: new mongoose.Types.ObjectId(),
  //   product: req.body.productId,
  //   quantity: req.body.quantity,
  // });

  // order
  //   .save()
  //   .then((result) => {
  //     console.log(result);
  //     res.status(201).json(result);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ error: err });
  //   });

  // res.status(201).json({
  //   message: "Handling POST requests in orders route",
  //   order: order,
  // });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;

  Order.findById(id)
    .select("product quantity _id")
    .exec()
    .then((order) => {
      console.log("From database", order);
      if (doc) {
        res.status(200).json({
          order: order,
          request: {
            type: "GET",
            description: "get order with id " + order._id,
            url: "http://localhost:3000/order/" + order._id,
          },
        });
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

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;

  // res.status(200).json({
  //   message: "order deleted!",
  //   orderId: req.params.orderId,
  // });

  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted with id " + id,
        request: {
          type: "DELETE",
          url: "http://localhost:3000/order/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
