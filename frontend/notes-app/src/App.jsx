import React from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
//defining routes
const routes = (
  <Router>
    <Routes>
      <Route path='/dashboard' element={<Home/>}></Route>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
    </Routes>
  </Router>
)
const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App