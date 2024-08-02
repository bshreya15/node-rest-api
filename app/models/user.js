const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email:{type:String, required:true},
  Password:{type:String, required:true},
});

module.exports = mongoose.model("User", userSchema);
