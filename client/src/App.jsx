import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import RoutineTasks from './components/RoutineTasks.jsx'
import CurrentDate from './components/CurrentDate'
import WIPTasks from './components/WIP.jsx'

function App() {
  return (
    <>
      <CurrentDate />
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <RoutineTasks />
        </div>
        <div className="flex-">
          <WIPTasks />
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default App
