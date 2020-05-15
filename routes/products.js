const express = require('express')
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})
const upload = multer({storage: storage})

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().select('name price _id productImage')
        const response = {
            count: products.length,
            products: products.map(result => {
                return {
                    id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${result.id}`
                    }
                }
            })
        }
        res.json(response)
    } catch (err) {
        res.json({message: err})
    }
})

router.post('/', checkAuth, upload.single('productImage'), async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    try {
        const saveProduct = await product.save();
        const response = {
                message: "product added",
                id: saveProduct.id,
                name: saveProduct.name,
                price: saveProduct.price,
                request: {
                type: 'GET',
                url: `http://localhost:3000/products/${saveProduct.id}`
                    
                }
                
        }
        res.json(response)
    } catch (err) {
        res.json({message: err})
    }
});

router.get('/:productId', async (req, res) => {
   try {
       const product =  await Product.findById(req.params.productId).select('id name price productImage');
       if (!product) {
            return res.json({
                    message: 'product not found'
                })
        } 
       const response = {
                id: product._id,
                name: product.name,
                price: product.price,
                productImage: product.productImage,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/`
                }
    }
       res.json(response)
   } catch (err) {
    res.json({
        message: 'product not found',
        error: err
    })
   }
    
})

router.delete('/:productId', checkAuth, async (req, res) => {
    try {
        const removeProduct = await Product.deleteOne({_id: req.params.productId})
        const result = {
            message: 'product deleted',
            Deleted_Product: removeProduct
        }
        res.send(result);
    } catch (err) {
        res.send(`message: ${err}`);
    }
});

router.patch('/:productId', checkAuth, async (req, res) => {
    try {
        const updateOp = {}
        for (const op of req.body) {
            updateOp[op.propName] = op.value
        }
        const updateProduct = await Product.updateOne({_id: req.params.productId}, {$set: updateOp})
        const response = {
            message: 'product updated',
            request: {
                type: 'GET',
                url: `http://localhost:3000/products/${req.params.productId}`
            }
        }
        res.send(response);
    } catch (err) {
        res.send(`message: ${err}`);
    }
});


module.exports = router;