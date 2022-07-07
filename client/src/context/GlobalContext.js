import React, {createContext, useContext, useReducer, useEffect} from 'react'
import axios from'axios';


// INITIAL STATE
const initialState = {
    user: null,
    fetchingUser: true,
    completeToDos: [],
    incompleteToDos: [],
}

// REDUCER - tells us how to interact with this state, how to set the state object to. 
const globalReducer = (state, action) => {

    switch (action.type) {

        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                fetchingUser: false,
            }
        
        case "SET_COMPLETE_TODOS":
            return {
                ...state,
                completeToDos: action.payload 
            }
        
        case "SET_INCOMPLETE_TODOS":
            return {
                ...state,
                incompleteToDos: action.payload 
            }

        case "RESET_USER":
            return {
                ...state,
                user: null,
                completeToDos: [],
                incompleteToDos: [],
                fetchingUser: false,
            }

        default:
            return state;
    }
}

// CREATE THE CONTEXT
export const GlobalContext = createContext(initialState)

//GLOBALPROVIDER COMPONENT WHICH WILL NEST ALL COMPONENTS INSIDE -  PROVIDER COMPONENT
export const GlobalProvider = (props) => {


    const[state, dispatch] = useReducer(globalReducer, initialState)

    // Every time the page reloads, do api request to get the current user to check if there is an access token in the cookies
    useEffect( () => {
        getCurrentUser()
    }, [])

    // ACTION 1: GET CURRENT USER
    // function that will get all the data we need once we think a user is logged in
    const getCurrentUser = async () => {
        try{

        // STEP 1: request to our backend using axios
        const res = await axios.get("/api/auth/current");
            // if there is a user data...
            if(res.data) {
                // request to grab users current todos and save them on toDosRes const variable
                const toDosRes = await axios.get("/api/todos/current")
                // if there is current to dos data...
                if(toDosRes.data) {
                    //we dispatch 
                    dispatch({type: "SET_USER", payload: res.data});
                    dispatch({type: "SET_COMPLETE_TODOS", payload: toDosRes.data.complete});
                    dispatch({type: "SET_INCOMPLETE_TODOS", payload: toDosRes.data.incomplete})
                }

                // if there is no data from the request, reset user
            } else {
                dispatch({type: "RESET_USER"})
            }

        } catch(err) {
            console.log(err)
            // Also if there is an error with any other request, reset user
            dispatch({type: "RESET_USER"});
        };
    }

    // ACTION 2: LOGOUT
    const logout = async () => {
        try {
            // calls our logout api route
            await axios.put("/api/auth/logout");

            // if we succesfully logout we dispatch
            dispatch({type: "RESET_USER"})
        } catch (err) {
            console.log(err);
            // Also if there is any error with "/api/auth/logout") endpoint, reset user
            dispatch({type: "RESET_USER"})
        }
    }


    // ACTION 3: ADD NEW TODO
    const addToDo = (toDo) => {
        // any new todo is an incomplete todo
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            // to add the new to do to the top of array, we add it first and then after we spread the incompletetodos array
            payload: [toDo, ...state.incompleteToDos]
        })
    }

    // ACTION 4: MARK TO DO AS COMPLETE
    // the todo will be passed to this function as a prop
    const toDoComplete = (toDo) => {
        // remove to do from incomplete list
        dispatch( {
            type: "SET_INCOMPLETE_TODOS",
            // Filter through existing todo based on id and remove it
            // Payload equals to the existing todos, they are filtered, each todo are passed as a param (incompleteToDo)
            // to the filter function which returns every todo that does not equal (!==) to the toDo id received in the
            // toDoComplete function parameter. 
            payload: state.incompleteToDos.filter((incompleteToDo) => 
                incompleteToDo._id !== toDo._id
            )
        })

        // move todo to complete list
        dispatch({
            type: "SET_COMPLETE_TODOS",
            // to add the todo recieved as a paramter to the top of array, we add it first and then after 
            // we spread the incompletetodos array.
            payload: [toDo, ...state.completeToDos]
        })
    }

    // ACTION 5: MARK TO DO AS INCOMPLETE
    // the todo will be passed to this function as a prop
    const toDoIncomplete = (toDo) => {

        dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: state.completeToDos.filter(
                (completetoDo) => completetoDo._id !== toDo._id
            ),
        })

        // We want to move back the completed todo back to the incomplete list in the same space it was, not on top
        // as a new incomplete. The incomplete todos are sorted by the date created. We need to do a comparison, 
        // sort through array and make sure it goes in correct place.

        // Moving back the complete to do to the incomplete todo section cant be done like ACTION4 because complete
        // todos are sorted out by most recent completed. The incomplete todos are sorted by the date created so if
        // we just move the complete to incomplete it could return to the middle of the incomplete list and we want
        // it at the top. So we need to sort through array and make sure it goes b

        // copy of the Incompletetodos array and we will add our todo passed
        const newIncompleteToDos = [toDo, ...state.incompleteToDos]

        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: newIncompleteToDos.sort(
                //we are comparing a and b
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
        })
    }

    // ACTION 6: DELETE TO DO
    // A todo will be passed to this function as a prop. To remove that toDo, we have to update the state by dispatching
    // all the todos except we passed to this function for both complete and incomplete todos.
    const removeToDo = (toDo) => {
        if(toDo.complete) {
            dispatch({
                type: "SET_COMPLETE_TODOS",
                // filter the state completetodos array and return all todos that not equal the todo we passed in
                payload: state.completeToDos.filter(
                    (completeToDo) => completeToDo._id !== toDo._id
                )
            })
        }else {
            dispatch({
                type: "SET_INCOMPLETE_TODOS",
                payload: state.incompleteToDos.filter(
                    (incompleteToDo) => incompleteToDo._id !== toDo._id
                )
            })
        }

    }

    // ACTION 6: UPDATE TODO
    // Map through current to dos, remove old version we have on the state nad replace it with neew version returned from api
    const updateToDo = (toDo) => {
        if(toDo.complete) {
            // new complete todo array which we map
            const newCompleteToDos = state.completeToDos.map(
                // for each completed todo, if the completed todo does not match the new updated (passed) todo id,
                // just return the complete to do to the array if not return the new updates toDo.
                ((completeToDo) => completeToDo._id !== toDo._id ? completeToDo : toDo)
            );

            dispatch({
                type: "SET_COMPLETE_TODOS",
                payload: newCompleteToDos,
            })
        }else {
            const newIncompleteToDos = state.incompleteToDos.map(
                ((incompleteToDo) => incompleteToDo !== toDo.id ? incompleteToDo : toDo)
            );

            dispatch({
                type: "SET_INCOMPLETE_TODOS",
                payload: newIncompleteToDos,
            })
        }
    }



    const value = {
        ...state,
        // Exporting this on the value lets us use it in other components to get the current user
        getCurrentUser,
        logout,
        addToDo,
        toDoComplete,
        toDoIncomplete,
        removeToDo,
        updateToDo
    }

    return (
        <GlobalContext.Provider value={value}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export function useGlobalContext() {
    return useContext(GlobalContext);
}
