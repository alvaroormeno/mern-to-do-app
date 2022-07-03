const express = require('express');
const router = express.Router();
const ToDo = require('../models/ToDo');
const requiresAuth = require("../middleware/permissions");
const validateToDoInput = require("../validation/toDoValidation")


//Route - GET /api/todos/test
//Description - Test the todos route
//Access - Public
router.get("/test", (req, res) => {
    res.send("ToDos route working!")
})


//Route - POST /api/todos/test
//Description - Create a new todo
//Access - Private (You have to be logged in to create a new todo)
router.post("/new", requiresAuth, async (req, res) => {
    try {

        // STEP 1 - Validate the to do. (If its empty or if it has less than 1 character or more than 300)
        // Deconstruct the value of validateToDoInput since we need isValid to check if its true or false.
        const {isValid, errors} = validateToDoInput(req.body);
        // if the return of validateToDoInput() is false then return error 400
        if(!isValid) {
            return res.status(400).json(errors)
        }

        // STEP 2 - If validation went ok, create a new todo
        const newToDo = new ToDo( {
            user: req.user._id,
            content: req.body.content,
            complete: false,
        })

        //save the new todo
        await newToDo.save();

        return res.json(newToDo)

    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message)
    }
})



//Route - GET /api/todos/current
//Description - return current todos
//Access - Private
router.get("/current", requiresAuth, async (req, res) => {
    try{
        // return complete todos
        const completeToDos = await ToDo.find(
            {
                user: req.user._id,
                complete: true,
            }
        ).sort({completedAt: -1});

        const incompleteToDos = await ToDo.find({
            user: req.user._id,
            complete: false
        }).sort({createdAt: -1});

        return res.json({incomplete: incompleteToDos, complete: completeToDos })

    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message)

    }
})


module.exports = router;