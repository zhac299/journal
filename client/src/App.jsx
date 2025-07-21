import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import './App.css'
import RoutineTasks from './components/RoutineTasks.jsx'
import CurrentDate from './components/CurrentDate'
import { ContentHolder } from './components/ContentHolder.jsx'
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

  var [otherWIPTasks, setOtherWIPTasks] = useState([]);
  useEffect(() => {
    async function getAllOtherWIPTasks() {
      const response = await fetch(endpoint + "other/wip");
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      let other = await response.json();
      setOtherWIPTasks(other);
      console.log(other);
    }
    getAllOtherWIPTasks();
    return;
  }, [otherWIPTasks.length]);

  return (
    <>
      <CurrentDate />
      <br></br>
      <div>
        <RoutineTasks />
      </div>
      <br></br>
      <DndContext collisionDetection={closestCorners}>
        <ContentHolder nWIPTasks={otherNWIPTasks} WIPTasks={otherWIPTasks} />
      </DndContext>

      <Outlet />
    </>
  )
}

export default App
