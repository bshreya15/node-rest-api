const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pName:String,
    price:Number
});

module.exports= mongoose.model('Product',productSchema)