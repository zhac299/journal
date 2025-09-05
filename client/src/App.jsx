import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import CurrentDate from './components/CurrentDate'
import ContentHolder from './components/ContentHolder.jsx'

export const endpoint = "http://localhost:5050/tasks/"

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
