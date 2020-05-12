const express = require('express')
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/signup', async(req, res) => {
    try {
        userExists = await User.find({email: req.body.email})
        if (userExists >= 1) {
            return res.json({
                message: 'email exists in our database'
            })
        }
    } catch (error) {
        return res.json({
            error: error
        })
    }
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({
                error: error
            })
        } else {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            saveUser = user.save()
                .then(result => {
                    console.log(result);
                    res.json({
                        message: 'account created',
                    })
                })
                .catch(err => {
                    res.json({
                        message: 'could not create account',
                        error: err
                    })
                })
        }
    });
});

router.post('/login', async (req, res) => {
    try {
        user = await User.find({email: req.body.email})
        if (user.length < 1) {
            return res.json({
                message: 'Authentication failed'
            })
        } else{
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.json({
                        message: 'Authentication failed'
                    })
                }
                if (result) {
                    return res.json({
                        message: 'Authentication successful'
                    })
                }
            }
            )
        }
    } catch (error) {
        return res.json({
            error: error
        })
    }
});

router.delete('/:userId', async (req, res) => {
    userId = req.params.userId
    try {
        del = await User.remove({_id: userId})
        res.json({
            message: 'user deleted'
        })
    } catch (err) {
        res.json({
            message: 'an error occured',
            error: err
        })
    }
});

module.exports = router;