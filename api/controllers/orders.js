const Order = require("../models/order")

exports.orders_get_all = (req, res, next) => {
    // res.status(200).json({
    //   message: "Handling GET requests in orders route",
    // });
  
    Order.find()
      .select("product quantity _id")
      .populate('product','pName')
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
    }