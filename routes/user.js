const express = require('express')
const router = express.Router();
const User = require('../models/User');

router.post('/signup', (req, res) => {
    const user =new User({
        name: req.body.name,
        password: req.body.password
    });
});

module.exports = router;