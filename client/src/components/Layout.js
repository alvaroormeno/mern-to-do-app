import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './Header.js'
import AuthBox from './AuthBox.js'

const Layout = () => {
  return (
    <BrowserRouter>
        <Header/>

        <Routes>
            <Route exact path='/' element={<AuthBox/>}></Route>
            <Route path='/register' element={<AuthBox register />}></Route>

        </Routes>


    </BrowserRouter>
  )
}

export default Layout