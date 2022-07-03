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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Route - PUT /api/todos/:toDoId/complete
//Description - Mark a todo as complete
//Access - Private
router.put("/:toDoId/complete", requiresAuth, async(req, res) => {
    try {
        //Grab todo to be able to pass the Id of the todo
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,
        });
        // error checking 1
        if(!toDo) {
            return res.status(404).json({error: 'Could not find a ToDo'})
        }
        // error checking 2
        if(toDo.complete) {
            return res.status(400).json({error: "ToDo is already complete"})
        }

        // uodate the todo
        const updatedToDo = await ToDo.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.toDoId,        
            },
            // 2nd paramater we tell what we want to update
            {
                complete: true,
                completedAt: new Date()
            },
            {
                new: true
            }
            ); 

            return res.json(updatedToDo);

    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message)
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Route - PUT /api/todos/:toDoId/incomplete
//Description - Mark a todo as INCOMPLETE
//Access - Private
router.put("/:toDoId/incomplete" , requiresAuth, async (req, res) => {
    try{

        // STEP 1 - Find specifc ToDo based on the id which is passed on the URL to check for errors
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,
        })
        // STEP 2 - Find Errors
        // If ToDo variable is impty/false then return 400 error with message as json
        if(!toDo) {
            return res.status(400).json({error: "Could not find ToDo"})
        }
        // If ToDo variable is the opposite (!) of a found todo based on the id and complete (therefore incomplete),
        // then return 400 error with message as json
        if(!toDo.complete) {
            return res.status(400).json({error: "ToDo is already incomplete"})
        }
        //STEP 3 - FIND AND UPDATE THE TO DO
        // Note - findOneAndUpdate() accepts 3 params. findOneAndUpdate(A, B, C)
        // A = query to find, B = what to update, C = option to return new updated data or old before updated data, default is always old before update
        const updatedToDo = await ToDo.findOneAndUpdate(
            // (A) Find a specific todo based on the id which is passed on the URL
            {
                user: req.user._id,
                _id: req.params.toDoId,
            },
            // (B) Update the complete property value to False, update the completed time to zero therefore Null
            {
                complete: false,
                completedAt: null,
            },
            // (C) Option to retun the updated data of ToDo
            {
                new: true
            }
        );
        
        return res.json(updatedToDo)


    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Route - PUT /api/todos/:toDoId
//Description - Update the content of a ToDo
//Access - Private
router.put("/:toDoId", requiresAuth, async (req, res) => {
    try{

        // STEP 1 - FIND THE TODO TO CHECK IF IT EXISTS
        // a. Variable toDo = the return value of findOne() which finds a specific todo with the toDoId passed in the URL
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,
        });
        // b. If no todo was found / toDo variable = false, then return an error of 400
        if(!toDo) {
            return res.status(400).json({error: "Could not find a todo"})
        }

        // STEP 2 - VALIDATE CONTENT OF THE TODO
        // a. Destructure the validateToDoInput() function be able to use isValid and errors separetly. Then we call validateToDoInput()
        // and pass the query body (req.body) and let it run, it will return values for isValid and errors.
        const{isValid, errors} = validateToDoInput(req.body)
        // b. if is valid equals to false (!isValid), then return a status of 400 with the errors from validateToDoInput as json. 
        if(!isValid) {
            return res.status(400).json(errors);
        }

        //STEP 3 - FIND AND UPDATE THE TO DO
        // Note - findOneAndUpdate() accepts 3 params. findOneAndUpdate(A, B, C)
        // A = query to find, B = what to update, C = option to return new updated data or old before updated data, default is always old before update
        const updatedToDo = await ToDo.findOneAndUpdate(
             // (A) Find a specific todo based on the id which is passed on the URL
            {
                user: req.user._id,
             _id: req.params.toDoId,
            },
            // (B) Update the content property value to the new value from the query body (req.body.content)
            {
                content: req.body.content
            },
            // (C) Option to retun the updated data of ToDo
            {
                new: true
            }
        );

        return res.json(updatedToDo);


    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message)
    }
})

//Route - DELETE /api/todos/:toDoId
//Description - Delete a specific todo
//Access - Private
router.delete("/:toDoId", requiresAuth, async (req, res) => {
    try{

        // STEP 1 - FIND THE TODO TO CHECK IF IT EXISTS
        // a. Variable toDo = the return value of findOne() which finds a specific todo with the toDoId passed in the URL
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,
        });
        // b. If no todo was found / toDo variable = false, then return an error of 400
        if(!toDo) {
            return res.status(404).json({error: "Could not find a todo"})
        }

        // STEP 2 - DELETE TODO
        // a. If we find to do, delete it straight away, no need to add to a variable becayse nothing should be returned
        await ToDo.findOneAndRemove({
            user: req.user._id,
            _id: req.params.toDoId,
        });
        // b. We dont want to return a todo we just deleted so we want to return a json message after deleting stating success: true
        return res.json({success: true})

    } catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
})



module.exports = router;