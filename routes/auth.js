// HERE WE DEFINE ALL OF OUR AUTH ROUTES

//import express
const express = require('express');
const router = express.Router();

//test
router.get("/test", (req, res) => {
    res.send("Auth route working");
})

module.exports = router;