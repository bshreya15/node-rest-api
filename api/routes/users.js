const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");
// const Product = require("../models/product");
// const product = require("../models/product");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Account with this email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req,res,next)=>{
  User.find({
    email: req.body.email
  }).exec().then(user =>{
    if(user.length < 1){
      return res.status(401).json({
        message:"Authentication failed"
      })
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
      if(err){
        return res.status(401).json({
          message:'Authentication failed'
        })
      }
      if(result){
        return res.status(200).json({
          message:"Authentication successful"
        })
      }
      res.status(401).json({
        message:'Authentication failed'
      })
    })

  }).catch((err) => {
    console.log(err);
    res.status(500).josn({
      error: err,
    });
  });
})

router.delete("/:userId", (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).josn({
        error: err,
      });
    });
});

module.exports = router;
