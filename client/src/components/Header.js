import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext';

const Header = () => {

    // Destructure useGlobalContext to be able to grab user, logout 
    const {user, logout} = useGlobalContext();

    // Destructure useLocation to be able to use pathname
    const {pathname} = useLocation();

  return (
    <div className="main-header">
        <div className="main-header__inner">
            <div className="main-header__left">
                <Link to="/">
                    ToDo List
                </Link>
            </div>

            <div className="main-header__right">
                {/* If there is a user we want to show logout button, if not, if pathname = "/" which is our login
                page url path, show the register button, if we are not located on "/" show Login button. 
                Note: Link to register and login shows as button since its using className='btn' */}
                {user ? (
                    // onClick={logout} = when we click we are calling logout function in useGlobalContext which logs out the user
                    <button className='btn' onClick={logout}>Logout</button>
                ) : pathname === "/" ? (
                    <Link to="/register" className='btn'>
                        Register
                    </Link> 
                ) : (
                    <Link to="/" className='btn'>
                        Login
                    </Link> 
                )
                    
                }
                
            </div>
        </div>
    </div>
  )
}

export default Header