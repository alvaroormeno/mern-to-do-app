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
        default:
            return state;
    }
}

// CREATE THE CONTEXT
export const GlobalContext = createContext(initialState)

// PROVIDER COMPONENT
export const GlobalProvider = (props) => {
    const[state, dispatch] = useReducer(globalReducer, initialState)

    // action: get current user
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