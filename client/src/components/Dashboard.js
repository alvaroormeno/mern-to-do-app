import React, { useEffect } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const {user} = useGlobalContext();
    const navigate = useNavigate();


    // Here we do the opposite of authbox. To protect app and not let people enter the dashboard unless logged in or
    // we logout inside the dashboard, we use useEffect to triger the navigate function that takes us to the 
    // login page ("/") if there if there is no user in the useGlobalContext function state
    useEffect( () => {
        if(!user && navigate) {
            navigate("/");
        }

    }, [user, navigate])



  return (

    


    // protect dashboard if there is no user
    <div>Dashboard</div>
  )
}

export default Dashboard