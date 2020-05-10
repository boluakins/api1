const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .select("id product quantity")
      .populate("product", "name");
    if (orders.length <= 0) {
      return res.json({
        message: "no record available"
      });
    }
    const response = {
      count: orders.length,
      orders: orders.map(result => {
        return {
          id: result.id,
          product: result.product,
          quantity: result.quantity,
          request: {
            type: "GET",
            url: `http://localhost:3000/orders/${result.id}`
          }
        };
      })
    };
    res.json(response);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

router.post("/", async (req, res) => {
  const order = new Order({
    product: req.body.productId,
    quantity: req.body.quantity
  });
  try {
    pId = req.body.productId;
    product = await Product.findById(pId);
    if (!product) {
      return res.json({
        message: "product not found"
      });
    }
    const saveOrder = await order.save();
    const result = {
      message: "order created",
      id: saveOrder.id,
      product_Id: saveOrder.product,
      quantity: saveOrder.quantity,
      request: {
        type: "GET",
        url: `http://localhost:3000/orders/${saveOrder.id}`
      }
    };
    res.json(result);
  } catch (err) {
    res.json({
      message: "product not found",
      error: err
    });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "product",
      "name"
    );
    if (!order) {
      return res.json({
        message: "order not found"
      });
    }
    const result = {
      id: saveOrder.id,
      product_Id: saveOrder.product,
      quantity: saveOrder.quantity
    };
    res.json(result);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

/* router.patch('/:orderId', async (req, res) => {
    try {
        const updateOrder = await Order.updateOne({
            _id: req.params.orderId
        }, {
            $set: {
                title: req.body.title
            }
        })
        if (!product) {
            return res.json({
                    message: 'product not found'
                })
        } 
        res.send(updateOrder);
    } catch (err) {
        res.send(`message: ${err}`);
    }
}); */

router.delete("/:orderId", async (req, res) => {
  try {
    const removeOrder = await Order.deleteOne({
      _id: req.params.orderId
    });
    res.json({
      message: "order deleted",
      feedback: removeOrder
    });
  } catch (err) {
    res.send(`message: ${err}`);
  }
});

module.exports = router;
