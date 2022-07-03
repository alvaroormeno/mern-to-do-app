// HERE WE DEFINE ALL OF OUR AUTH ROUTES

//import express
const express = require('express');
const router = express.Router();

const User = require('../models/User');

const bycrypt = require('bcryptjs')

const validateRegisterInput = require('../validation/registerValidation')

const jwt = require('jsonwebtoken')

const requiresAuth = require("../middleware/permissions")

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


        // ADDED SO THAT WHEN USER REGISTERS, IT AUTOMATICALLY SIGNS HIM IN BY CREATING A TOKEN FOR THAT USER
        // Create a token
        const payload = {userId: savedUser._id};
        // encode the payload using JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
        // use token to set cookie - .cookie(name, value, options)
        res.cookie("access-token", token, {
            // expires in 7 days
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            // can only be accesed by http server, no one can open it on a browsers console
            httpOnly: true,
            // if we are in production secure: value is true if we are not in productions its equal to false, so for local debugging we wont use secure token
            secure: process.env.NODE_ENV === "production"
        });


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


//Route - POST /api/auth/login
//Description - Login user and return access token
//Access - Public
router.post("/login", async (req, res) => {
    try{
        //STEP 1 - Check for the user email if is already saved on database. .findOne() will return the complete array
        // of the user that matches the criteria specified, being email here. 
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
        //STEP3 - Create a token
        const payload = {userId: user._id};
        // encode the payload using JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
        // use token to set cookie - .cookie(name, value, options)
        res.cookie("access-token", token, {
            // expires in 7 days
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            // can only be accesed by http server, no one can open it on a browsers console
            httpOnly: true,
            // if we are in production secure: value is true if we are not in productions its equal to false, so for local debugging we wont use secure token
            secure: process.env.NODE_ENV === "production"
        });

        const userToReturn = {...user._doc};
        delete userToReturn.password;

        return res.json({
            token: token,
            user: userToReturn,
        })

    } catch(err) {
        console.log(err)

        return res.status(500).send(err.message)
    }
})


//Route - GET /api/auth/current
//Description - Return the currently authorized user
//Access - Private
//NOTE -  having requiresAuth verifies user is an authorized user
router.get("/current", requiresAuth,(req, res) => {
    //STEP 1 - Just in case double check that there is a user, shouldnt happen but just in case
    if(!req.user) {
        return res.status(401).send("Unauthorized!!!");
    }

    return res.json(req.user);

})


//Route - POST /api/auth/logout
//Description - Logout user and clear the cookie
//Access - Private
router.put("/logout", requiresAuth, async (req, res) => {
    try{
        // STEP 1 - Clear the cookie named "access-token", the only reason why a user is logged in its because he has a cookie/access-token
        res.clearCookie("access-token")
        // STEP 2 - Once cookie has been cleared, return a json message of success: true to let user he has been logged out succefully
        return res.json({success: true})

    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message)
    }
})


module.exports = router;