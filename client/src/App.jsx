import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import CurrentDate from './components/CurrentDate'
import ContentHolder from './components/ContentHolder.jsx'

function App() {
  return (
    <>
      <CurrentDate />
      <br></br>
        <ContentHolder />
      <Outlet />
    </>
  )
}

export default App
