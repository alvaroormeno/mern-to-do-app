import React, {useRef, useState} from 'react'
import axios from 'axios'
import { useGlobalContext } from '../context/GlobalContext'

// {toDo} means we are destrucurting the prop received to grab the toDo value of that prop.
const ToDoCard = ({toDo}) => {

    const [content, setContent] = useState(toDo.content)
    const [editing, setEditing] = useState(false)
    const input = useRef(null);

    const {toDoComplete, toDoIncomplete, removeToDo, updateToDo } = useGlobalContext();

    const onEdit = (e) => {
        e.preventDefault();
        // sets setEditing state to true
        setEditing(true);
        // makaes the current input focus
        input.current.focus();

    }

    const stopEditing = (e) => {
        if(e) {
            e.preventDefault()
        }

        // change editing state back to false/not editing
        setEditing(false);
        // since we click cancel on a half edited todo, we want to change back the content to the original content
        setContent(toDo.content)

    }

    const markAsComplete = (e) => {
        e.preventDefault();
        // axios call to update todo based on id to complete
        axios.put(`/api/todos/${toDo._id}/complete`).then(res => {
            toDoComplete(res.data)
        })
    }

    const markAsIncomplete = (e) => {
        e.preventDefault();
        // axios call to update todo based on id to incomplete
        axios.put(`/api/todos/${toDo._id}/incomplete`).then(res => {
            toDoIncomplete(res.data)
        })
    }

    const deleteToDo = (e) => {
        e.preventDefault();

        if(window.confirm("Are you sure you want to delete this ToDo? ")) {
            axios.delete(`/api/todos/${toDo._id}`).then(() => {
                // call action in GlobalContext.js
                removeToDo(toDo);
            })
        }
    }

    const editToDo = (e) => {
        e.preventDefault() 
        // call api to update todo based on id with the content passed
        axios.put(`/api/todos/${toDo._id}`, {content}).then((res) => {
            // call edit action on GlobalContext.js
            updateToDo(res.data)
            // change editing state to false so front end stops editing
            setEditing(false)

            // dont care much about erros, but just in case call stopEditing function
        }).catch(() => {
            stopEditing();
        })
        
    }

  return (
    <div className={`todo ${toDo.complete ? "todo--complete" : ""}`}>


        <input 
            type="checkbox" 
            checked={toDo.complete} 
            onChange={!toDo.complete ? markAsComplete : markAsIncomplete}/>
        {/* The content of the todo will be inside of a text input. This will let us edit it later on. */}
        <input 
            type="text"
            // Lets us focus on the input once we start editing it
            ref={input} 
            // The value is set to the content state which its initial state is te actual todo content
            value={content} 
            // readOnly lets us edit the input based on true or false. Its set to the editing state
            readOnly={!editing}
            // onChange calls function that sets the setContent to the value of the input, therefore we can start typing/editing
            onChange={(e) => setContent(e.target.value)}
        />
        <div className="todo__controls">
            {/* If its not editing, show edit and delete button, if it is show cancel and save */}
            {!editing ? (
                <>
                {/* If it is not complete show the edit button */}
                {!toDo.complete && (<button onClick={onEdit}>Edit</button>)}
                <button onClick={deleteToDo}>Delete</button>
                </>
            ) : (
                <>
                <button onClick={stopEditing}>Cancel</button>
                <button onClick={editToDo}>Save</button>
                </>

            )}

            
            
        </div>
        
    </div>
  )
}

export default ToDoCard