import axios from 'axios'
import React, {useState} from 'react'
import { useGlobalContext } from '../context/GlobalContext'

const NewToDo = () => {
    // Destructuring useGlobalContext to extract addToDo action
    const {addToDo} = useGlobalContext();

    const [content, setContent] = useState("")

    const changeContent = function (e) {
        setContent(e.target.value)
    }

    const onSubmit = function(e) {
        e.preventDefault();

        // STEP 1: axios post call to create new todo api and sends content of input
        axios.post("/api/todos/new", {content}).then(res => {
            // then sets back the content state of the input to empty("")
            setContent("")
            // action of add to do to add it to our globalcontext
            addToDo(res.data)
        })
    }

  return (
    <form className="new" onSubmit={onSubmit}>
        <input 
            type="text"
            value={content}
            onChange={changeContent}  />

        <button className='btn' disabled={content.length == 0}>Add</button>
    </form>
  )
}

export default NewToDo