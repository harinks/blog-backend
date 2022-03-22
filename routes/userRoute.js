const router = require('express').Router();
const User = require('../models/userModel');

const authUser = require('../middleware/auth');

//register user
router.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({name, email, password});
        //await user.generateAuthToken();
        res.status(201).json(user);
    } catch (error) {
        let msg;
        if(error.code == 11000){
            msg = 'Email already exists'
        }
        else{
            msg = error.message;
        }
        res.status(400).json(msg)
    }
});

//login user
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.json({user, token})
    } catch (error) {
        res.status(400).json(error.message)
    }
})


//logout user
router.delete('/logout', authUser, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            return tokenObj.token !== req.token;
        })
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).json(error.message);
    }
})

module.exports = router;