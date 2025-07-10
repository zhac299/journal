import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import RoutineTasks from './components/RoutineTasks.jsx'
import CurrentDate from './components/CurrentDate'

function App() {
  return (
    <>
      <div className="w-full p-6">
        <CurrentDate />
        <RoutineTasks />
        <Outlet />
      </div>
    </>
  )
}

export default App
