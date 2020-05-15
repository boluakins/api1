const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const OrdersController = require('../controllers/orders')

router.get("/", checkAuth, OrdersController.get_all);

router.post("/", checkAuth, OrdersController.post_order);

router.get("/:orderId", OrdersController.get_one);

/* router.patch('/:orderId', OrdersController.update_order ); */

router.delete("/:orderId", checkAuth, OrdersController.delete_order);

module.exports = router;
