const express = require('express');
const app = express();

const productRoutes = require('./app/routes/products')
const orderRoutes = require('./app/routes/orders')

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req, res, next)=>{
    res.status(200).json({
        message:'It works! \n 1. /products'
    })
})

module.exports =app;