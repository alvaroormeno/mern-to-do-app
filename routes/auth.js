// HERE WE DEFINE ALL OF OUR AUTH ROUTES

//import express
const express = require('express');
const router = express.Router();

const User = require('../models/User');

const bcrypt = require('bcryptjs')



//Route - GET /api/auth/test
//Description - Test the auth route
//Access - Public
router.get("/test", (req, res) => {
    res.send("Auth route working");
})

//Route - POST /api/auth/register
//Description - Create a new user
//Access - Public
router.post("/register", async(req, res) => {
    //try code in here
    try{
        //hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        //create new user
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });

        //save the user to the database
        const savedUser = await newUser.save();

        // return the new user
        return res.json(savedUser);
        
     //if try doesnt work, catch error
    }catch (err) {
        
        console.log(err);
        // respond error with status(500) which means server error and error message
        res.status(500).send(err.message)
    }
})



module.exports = router;