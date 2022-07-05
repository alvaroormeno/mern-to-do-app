import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'

const AuthBox = ({register}) => {

    //Create email state to grab value from email input
    const [email, setEmail] = useState("")
    //Creating states for password, confirmPassword and name to grab values from their inputs
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
       


  return (
    <div className="auth">
        <div className="auth__box">
            <div className="auth__header">
                <h1>
                    {/* Inline If-Else with Conditional Operator */}
                    {register ? "Register" : "Login"}
                </h1>
            </div>

            <form>
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
                    <button className="btn">
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