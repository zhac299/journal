import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import Navbar from './components/Navbar'
import CurrentDate from './components/CurrentDate'

function App() {
  return (
    <>
      <div className="w-full p-6">
        <CurrentDate />
        <Outlet />
      </div>
    </>
  )
}

export default App
