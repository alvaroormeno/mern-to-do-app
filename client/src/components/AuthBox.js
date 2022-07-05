import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'

const AuthBox = ({register}) => {

    //Creating states for email, password, confirmPassword and name to grab values from their inputs
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    // Loading state for when we click Register button    
    const [loading, setLoading] = useState(false)
    // Errors state, if there are any errors when we submit our form we can set the errors and display them on the front end.
    const [errors, setErrors] = useState({})
       
    const onSubmit = (e) => {
        // prevents browser refresh
        e.preventDefault();
        setLoading(true);

        //NOTE: Since this component works for both registering or login in, depeding on which we need to grab
        // specific data from the states above to then send to the API 

        let data = {}
        // if we are registering we need access to the following data we will then send to our API
        if(register) {
            data= {
                name,
                email,
                password,
                confirmPassword,
            }
            
            // if we are not registering, therefore login in we need the following data to then send to API
        } else {
            data = {
                email,
                password,
            }
        }
    }

  return (
    <div className="auth">
        <div className="auth__box">
            <div className="auth__header">
                <h1>
                    {/* Inline If-Else with Conditional Operator */}
                    {register ? "Register" : "Login"}
                </h1>
            </div>

            <form onSubmit={onSubmit}>
                {/* Inline If with Logical && Operator */}
                {register && (
                    <div className="auth__field">
                        <label>Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                )}

                <div className="auth__field">
                    <label>Email</label>
                    <input 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="auth__field">
                    <label>Password</label>
                    <input 
                        type="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>

                {register && (
                    <div className="auth__field">
                        <label> Confirm Password</label>
                        <input 
                            type="Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />

                        {/* <p className="auth__error">Something went wrong</p> */}
                    </div>
                )}

                <div className="auth__footer">
                    <p className="auth__error">Something Went Wrong</p>
                    {/* disabled={loading} means we want to disable this button if loading is true */}
                    <button className="btn" type="submit" disabled={loading}>
                        {register ? "Register" : "Login"}
                    </button>

                    {!register ? (
                        <div className="auth__register">
                            <p>
                                Not a member? <Link to="/register">Register Now</Link>
                            </p>
                        </div>
                    ) : ( 
                        <div className="auth__register">
                            <p>
                                Already a member? <Link to="/">Login Now</Link>
                            </p>
                        </div>
                    )}
                </div> 
            </form>
        </div>
    </div>
  )
}

export default AuthBox