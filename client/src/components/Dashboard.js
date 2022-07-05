import React, { useEffect } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import ToDoCard from './ToDoCard'

const Dashboard = () => {

    const {user, completeToDos, incompleteToDos} = useGlobalContext();
    const navigate = useNavigate();


    // Here we do the opposite of authbox. To protect app and not let people enter the dashboard unless logged in or
    // we logout inside the dashboard, we use useEffect to triger the navigate function that takes us to the 
    // login page ("/") if there if there is no user in the useGlobalContext function state
    useEffect( () => {
        if(!user && navigate) {
            navigate("/");
        }

    }, [user, navigate])



  return (

    <div className="dashboard">
        <div className="todos">
            {/* Map incompleteToDos Array and display each on front end in ToDoCard. Since map needs a key we use the id from the todo */}
            {incompleteToDos.map((incTodoData) => (
            <ToDoCard
                toDo={incTodoData}
                key={incTodoData._id}
            /> 
            ))}
        </div>

        {/* We only want to show complete todos if there are any.  */}
        {completeToDos.length > 0 && (
            <div className="todos">
                <h2 className='todos__title'>Completed ToDo's</h2>
                {completeToDos.map((comTodoData) => (
                    <ToDoCard
                        toDo={comTodoData}
                        key={comTodoData._id}
                    /> 
                ))}
            </div>
        )}
    </div>

  
  )
}

export default Dashboard