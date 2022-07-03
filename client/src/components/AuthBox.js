import React from 'react'

const AuthBox = () => {
  return (
    <div className="auth">
        <div className="auth__box">
            <div className="auth__header">
                <h1>Login</h1>
            </div>

            <form>
                <div className="auth__field">
                    <label>Email</label>
                    <input type="text" />
                </div>

                <div className="auth__field">
                    <label>Password</label>
                    <input type="Password" />
                </div>

                <div className="auth__footer">
                    <p className="auth__error">Something Went Wrong</p>
                    <button className="btn">
                        Login
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AuthBox