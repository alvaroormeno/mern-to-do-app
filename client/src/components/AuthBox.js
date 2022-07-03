import React from 'react'

const AuthBox = ({register}) => {
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
                        <input type="text" />
                    </div>
                )}

                <div className="auth__field">
                    <label>Email</label>
                    <input type="text" />
                </div>

                <div className="auth__field">
                    <label>Password</label>
                    <input type="Password" />
                </div>

                {register && (
                    <div className="auth__field">
                        <label>Password</label>
                        <input type="Password" />

                        {/* <p className="auth__error">Something went wrong</p> */}
                    </div>
                )}

                <div className="auth__footer">
                    <p className="auth__error">Something Went Wrong</p>
                    <button className="btn">
                        {register ? "Register" : "Login"}
                    </button>
                </div> 
            </form>
        </div>
    </div>
  )
}

export default AuthBox