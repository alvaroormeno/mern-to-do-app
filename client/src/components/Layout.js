import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './Header.js'

const Layout = () => {
  return (
    <BrowserRouter>
        <Header/>

        <Routes>
            <Route exact path='/' element={<h1>HOME</h1>}></Route>
            <Route path='/test' element={<h1>TEST</h1>}></Route>

        </Routes>


    </BrowserRouter>
  )
}

export default Layout