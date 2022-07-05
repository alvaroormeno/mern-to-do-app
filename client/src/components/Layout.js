import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './Header.js'
import AuthBox from './AuthBox.js'

import { useGlobalContext } from '../context/GlobalContext.js'

const Layout = () => {

  // Deconstructing useGlobalContext to grab fetchingUser value
  const {fetchingUser} = useGlobalContext

  // If fetchingUser true, render Loading, if not render normal BrowserRouter. Loading = message while loading login
  return fetchingUser ? (
    <div className="loading">
      <h1>Loading</h1>
    </div>
  ) : (
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