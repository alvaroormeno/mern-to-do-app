import React, {useRef, useState} from 'react'

// {toDo} means we are destrucurting the prop received to grab the toDo value of that prop.
const ToDoCard = ({toDo}) => {

    const [content, setContent] = useState(toDo.content)
    const [editing, setEditing] = useState(false)
    const input = useRef(null);

  return (
    <div className="todo">


        <input type="checkbox"/>
        {/* The content of the todo will be inside of a text input. This will let us edit it later on. */}
        <input 
            type="text"
            // Lets us focus on the input once we start editing it
            ref={input} 
            // The value is set to the content state which its initial state is te actual todo content
            value={content} 
            // readOnly lets us edit the input based on true or false. Its set to the editing state
            readOnly={!editing}
        />
        <div className="todo__controls">
            <button>Edit</button>
            <button>Delete</button>
        </div>
        
    </div>
  )
}

export default ToDoCard