import React, {createContext, useContext, useReducer, useEffect} from 'react'
import axios from'axios';


// INITIAL STATE

const initialState = {
    user: null,
    fetchingUser: true,
    completeToDos: [],
    incompleteToDos: [],
}

// REDUCER - tells us how to interact with this state, 
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

        default:
            return state;
    }
}

// CREATE THE CONTEXT
export const GlobalContext = createContext(initialState)

// PROVIDER COMPONENT
export const GlobalProvider = (props) => {
    const[state, dispatch] = useReducer(globalReducer, initialState)

    // action: get current user - function that will get all the data we need once we think a user is logged in
    const getCurrentUser = async () => {
        try{

        // request to our backend using axios
        const res = await axios.get("/api/auth/current");
            // if there is a user, we expect data
        if(res.data) {
            // request to grab users current todos
            const toDosRes = await axios.get("/api/todos/current")
            // if there is data...
            if(toDosRes.data) {
                //dispatch 
                dispatch({type: "SET_USER", payload: res.data});
                dispatch({type: "SET_COMPLETE_TODOS", payload: toDosRes.data.complete});
                dispatch({type: "SET_INCOMPLETE_TODOS", payload: toDosRes.data.incomplete})
            }
        }

        } catch(err) {
            console.log(err)
        }
    }



    const value = {
        ...state,
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