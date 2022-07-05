import React from 'react'

// {toDo} means we are destrucurting the prop received to grab the toDo value of that prop.
const ToDoCard = ({toDo}) => {
  return (
    <div className="todo">
        {toDo.content}
    </div>
  )
}

export default ToDoCard