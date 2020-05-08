const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    product: {
        type: String,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Orders', OrderSchema)