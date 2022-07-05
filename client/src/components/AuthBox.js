import React, { useEffect } from 'react'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useGlobalContext } from '../context/GlobalContext'

const AuthBox = ({register}) => {

    //Destructing useGlobalContext to be able to use getCurrentUser function
    const {getCurrentUser, user} = useGlobalContext();

    //
    const navigate = useNavigate();

    //Creating states for email, password, confirmPassword and name to grab values from their inputs
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    // Loading state for when we click Register button    
    const [loading, setLoading] = useState(false)
    // Errors state, if there are any errors when we submit our form we can set the errors and display them on the front end.
    const [errors, setErrors] = useState({})



    // useEffect triggers when page reloads or if the second argument array[] has any changes. 
    // - This will trigger when [user] which is a key property imported from useGlobalContext changes. 
    // When it triggers, if user is true then navigate to the dashboard component to show todos. 
    // We then also added to the conditional if navigate is also true, which it will always be since it is 
    // function from react-reouter-dom. We do this to add an extra layer of check/security. Also when logged in, 
    // since the user has a true value, this hook wont let the user change the url and go to the register page 
    // or login page since its fixed to always navigate to dashboard.
    useEffect(() => {
        if(user && navigate){
            navigate("/dashboard");
        }
    }, [user])
       




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
        };

        // axios post request depending on register, passing data from authbox input 
        axios.post(register ? "/api/auth/register" : "/api/auth/login", data)
        .then(() => {
            // If we register, we are sending the data from the inputs to the api which registers the user. Once
            // registered the getCurrentUser function is called which grabs all the data from the current logged in user
            // and changed the GlobalContext state. Same if we log in, axios.post sends the input data to login route and
            // then again call getCurrentUser....
            getCurrentUser();



        }).catch(err => {
            setLoading(false);
            
            //if error, .? means if there is this property on error, if there is data property on reponse
            if(err?.response?.data) {
                setErrors(err.response.data)
            }
        })
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
                            onChange={(e) => setName(e.target.value)}
                        />
                        {/* Display error on front end. If error.name is true then show errors inside p element. */}
                        {errors.name && (<p className='auth__error'>{errors.name}</p>)}

                    </div>
                )}

                <div className="auth__field">
                    <label>Email</label>
                    <input 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (<p className='auth__error'>{errors.email}</p>)}
                </div>

                <div className="auth__field">
                    <label>Password</label>
                    <input 
                        type="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (<p className='auth__error'>{errors.password}</p>)}
                </div>

                {register && (
                    <div className="auth__field">
                        <label> Confirm Password</label>
                        <input 
                            type="Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && (<p className='auth__error'>{errors.confirmPassword}</p>)}
                    </div>
                )}

                <div className="auth__footer">
                    {/* If the errors object keys length is more the 0 then show error on front end */}
                    {Object.keys(errors).length > 0 && (
                        <p className="auth__error">
                            {register ? 'You have some validation errors!' : errors.error}
                        </p>
                    )}
                    
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