// HERE WE DEFINE ALL OF OUR AUTH ROUTES

//import express
const express = require('express');
const router = express.Router();

const User = require('../models/User');

const bycrypt = require('bcryptjs')

const validateRegisterInput = require('../validation/registerValidation')



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
        // destructuring to grab the errors and isValid from validateRegisterInput after running register user data
        const {errors, isValid} = validateRegisterInput(req.body);

        if(!isValid) {
            return res.status(400).json(errors);
        }


        //check for existing user by finding (findingOne()) an existing email in the database including same email with different capital letters
        const existingEmail = await User.findOne({
            
            email: new RegExp("^" + req.body.email + "$", "i")
        });
        if(existingEmail) {
            return res.status(400).json({error: "There is already a user with this email"});
        }

        //hash the password
        const hashedPassword = await bycrypt.hash(req.body.password, 12);

        
        //create new user
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });

        //save the user to the database
        const savedUser = await newUser.save();
        // After saving it, we need to create a new variable (userToReturn) which wont return the Password for more security...
        // ...savedUser spreads all the data from the const savedUser into new object, ._doc is needed
        // to show object as regular json object without mongoose/mongodb extra  meta fields for internal management
        const userToReturn = {...savedUser._doc};
        delete userToReturn.password;

        // return the new user
        return res.json(userToReturn);
        
     //if try doesnt work, catch error
    }catch (err) {
        
        console.log(err);
        // respond error with status(500) which means server error and error message
        res.status(500).send(err.message)
    }
})


//Route - POST /api/auth/loggin
//Description - Login user and return access token
//Access - Public
router.post("/login", async (req, res) => {
    try{
        //STEP 1 - Check for the user email if is already saved on database
        const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i")
        })
        // If it is not saved, return error message and stop
        if(!user) {
            return res.status(400).json({error: "There was a problem with your login credentials"})
        }
        //STEP 2- If the email is saved on Step1, compare password to password saved on database
        const passwordMatch = await bycrypt.compare(req.body.password, user.password)
        //  If the password entered doenst match password on database, return error and stop
        if(!passwordMatch) {
            return res.status(400).json({error: "There was a problem with your login credentials"})
        }

        return res.json({passwordMatch: passwordMatch})
        
    } catch(err) {
        console.log(err)

        return res.status(500).send(err.message)
    }
})



module.exports = router;