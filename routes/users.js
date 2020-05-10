const express = require('express')
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
   bcrypt.hash(req.body.password, 10, (err, hash) => {
       var hashedPassword;
        if (err) {
            return res.json({
                error: error
            })
        } else {
            return hash 
           
        }
        console.log(hashedPassword);
    });
    
    
   /*  const user = new User({
        email: req.body.email,
        password: hashedPassword
    })
    try {
        saveUser = await user.save()
        console.log(saveUser);
        
        res.json({
            message: 'account created',
        })
    } catch (err) {
        res.json({
            message: 'could not create account',
            error: err
        })
    } */
});

module.exports = router;