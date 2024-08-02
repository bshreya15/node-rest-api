const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const mongoose = require("mongoose");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //store file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// const upload = multer({dest:'uploads/'});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5mb
  },
  fileFilter: fileFilter,
});

const checkAuth = require("../middleware/check-auth");

router.get("/", (req, res, next) => {
  // res.status(200).json({
  //   message: "Handling GET requests in products route",
  // });
  Product.find()
    .select("pName price _id productImg")
    .exec()
    .then((docs) => {
      // console.log(docs);

      const response = {
        count: docs.length,
        description: "Get all products",
        products: docs.map((doc) => {
          return {
            pName: doc.pName,
            price: doc.price,
            productImg: doc.producImg,
            _id: doc._id,

            request: {
              type: "GET",

              url: "http://localhost:3000/products/" + doc._id,
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

router.post("/", checkAuth, upload.single("productImg"), ( req, res, next) => {
  // const product = {
  //     pName : req.body.pName,
  //     price : req.body.price
  // };

  console.log(req.file);

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    pName: req.body.pName,
    price: req.body.price,
    producImg: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          pName: result.pName,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
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
    .select("pName price _id productImg")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "get product with id " + doc._id,
            url: "http://localhost:3000/products/" + doc._id,
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
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "PATCH",
          url: "http://localhost:3000/products/" + id,
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

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;

  // res.status(200).json({
  //   message: "You deleted the ID",
  //   id,
  // });

  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted with id " + id,
        request: {
          type: "DELETE",
          url: "http://localhost:3000/products/" + id,
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
