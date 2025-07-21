import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import CurrentDate from './components/CurrentDate'
import ContentHolder from './components/ContentHolder.jsx'
import { closestCorners, DndContext } from '@dnd-kit/core'

function App() {
  return (
    <>
      <CurrentDate />
      <br></br>
      <DndContext collisionDetection={closestCorners}>
        <ContentHolder />
      </DndContext>

      <Outlet />
    </>
  )
}

export default App
