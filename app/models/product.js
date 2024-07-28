const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // pName:String,
  // price:Number

  //validtion
  pName: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
