const express = require('express')
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    try {
        users = await User.find().select('id email')
        res.json(users)
    } catch (err) {
        res.json({
            message: err
        })
    }
});

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
            message: "this error",
            error: error
        })
    }
    await bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({
                message: "password required",
                error: err
            })
        } else {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            saveUser = user.save()
                .then(result => {
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
            await bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.json({
                        message: 'Authentication failed 1'
                    })
                }
                if (result) {
                    
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        });
                        return res.json({
                            message: 'Authentication successful',
                            token: token
                        })
                } else{
                    return res.json({
                        message: 'Authentication failed 2'
                    })
                }
            }
            )
        }
    } catch (err) {
        return res.json({
            error: err
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