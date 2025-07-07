import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import Task from './components/Task'
import CurrentDate from './components/CurrentDate'

function App() {
  return (
    <>
      <div className="w-full p-6">
        <CurrentDate />
        <Task />
        <Outlet />
      </div>
    </>
  )
}

export default App
