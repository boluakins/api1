const express = require('express')
router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().select('id product quantity').populate('product', 'name')
        res.json(orders)
    } catch (err) {
        res.json({
            message: err
        })
    }
})

router.post('/', async (req, res) => {
    const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity
    });
    try {
            /* try {
            pId = req.body.productId;
            product = await Product.findById(pId);
            if (product === null) {
                return res.json({
                        message: 'product not found'
                    })
            }
            
        } catch (err) {
            res.json({error: 'product not found f',
            error: err})
        } remove else*/
        pId = req.body.productId;
        product = await Product.findById(pId);
        if (product === null) {
            return res.json({
                    message: 'product not found'
                })
        } else{
        const saveOrder = await order.save();
        const result = {
            message: "order created",
            id: saveOrder.id,
            product_Id: saveOrder.productId,
            quantity: saveOrder.quantity,
            request: {
                type: 'GET',
                url: `http://localhost:3000/orders/${saveOrder.id}`
            }
        }
        res.json(result)
        }
        
    } catch (err) {
        res.json({
            message: "product not found",
            error: err
        })
    }

});

router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        res.json(order)
    } catch (err) {
        res.json({
            message: err
        })
    }

})

router.patch('/:orderId', async (req, res) => {
    try {
        const updateOrder = await Order.updateOne({
            _id: req.params.orderId
        }, {
            $set: {
                title: req.body.title
            }
        })
        res.send(updateOrder);
    } catch (err) {
        res.send(`message: ${err}`);
    }
});

router.delete('/:orderId', async (req, res) => {
    try {
        const removeOrder = await Order.deleteOne({
            _id: req.params.orderId
        })
        res.send(removeOrder);
    } catch (err) {
        res.send(`message: ${err}`);
    }
});



module.exports = router;