import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import RoutineTasks from './components/RoutineTasks.jsx'
import CurrentDate from './components/CurrentDate'
import WIPTasks from './components/WIP.jsx'
import { ContentHolder } from './components/contentHolder.jsx'
import { closestCorners, DndContext } from '@dnd-kit/core'

function App() {

  const endpoint = "http://localhost:5050/tasks/"

  var [otherNWIPTasks, setOtherNWIPTasks] = useState([]);

  useEffect(() => {
    async function getAllOtherNWIPTasks() {
      const response = await fetch(endpoint + "other/nwip");
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      let other = await response.json();
      setOtherNWIPTasks(other);
      console.log(other);
    }
    getAllOtherNWIPTasks();
    return
  }, [otherNWIPTasks.length]);

  return (
    <>
      <CurrentDate />
      <br></br>
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <RoutineTasks />

          <DndContext collisionDetection={closestCorners}>
            <ContentHolder tasks={otherNWIPTasks}/>
          </DndContext>

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
