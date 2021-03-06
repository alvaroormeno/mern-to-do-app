// Allows to access environment variables written in the .env file
require("dotenv").config();

// Initializes express server
const express = require("express");
const app = express();

// import mongoose
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const path = require('path')



//IMPORT ROUTES
const authRoute = require("./routes/auth");
const toDosRoute = require("./routes/todos");

// Pointing express to the static build files when we build our app for deployment
app.use(express.static(path.resolve(__dirname, "./client/build")))

app.get("*"), (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"))
}



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// Express middleware service - recognizes the incoming Request Object as a JSON Object.
app.use(express.json());
// Express middleware service - recognizes the incoming Request Object as Strings or Arrays.
app.use(express.urlencoded({ extended: true }));
// Middleware to read and set cookies in request
app.use(cookieParser());

// First API ROUTE (default route) - Everytime we make a GET request to "/api" we then want to return something
app.get("/api", (req,res) => {
    res.send("Fullstack React Course Express Server");
})





// app.use tells express server to use
app.use("/api/auth", authRoute);
app.use("/api/todos", toDosRoute);





// connect to database - first will connect to database and then it will listen and start express server
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to database')

    // SERVER RUNNING - process.env.PORT acceses PORT in .env file
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)
    });

// if there is an error, we will console log it
}).catch((error) => {
    console.log(error);
});






////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETED CODE FOR FUTURE REFERENCE
////////////////////////////////////////////////////////////////////////////////////////////////////


// Second API ROUTE - post route to verify we can get through data we are sending. 
////////////////////////////////////////////////////////////////////////////////////////////////////
// app.post("/name", (req, res) => {
//     // if req.body.name (body of the request with key: name) is true, return request in json format,
//     // else return request as status 400 with json format message.
//     if(req.body.name) {
//         return res.json({name: req.body.name})
//     } else {
//         return res.status(400).json({error: "No name provided"})
//     }
// })