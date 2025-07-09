import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Task() {
  var [tasks, setTasks] = useState([]);
  const daysofWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const endpoint = "http://localhost:5050/"

  var [routineTasks, setRoutineTasks] = useState([]);
  var [otherWIPTasks, setOtherWIPTasks] = useState([]);
  var [otherNWIPTasks, setOtherNWIPTasks] = useState([]);

  useEffect(() => {
    // Fetch task data from the server
    async function getAllTasks() {
      const response = await fetch(endpoint + "tasks");
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      let tasks = await response.json();
      setTasks(tasks);
      console.log(tasks);
    }
    getAllTasks();
    return;
  }, [tasks.length]);

  useEffect(() => {
    async function getAllRoutineTasks() {
      const response = await fetch(endpoint + "routine");
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      let routine = await response.json();
      setRoutineTasks(routine);
      console.log(routine);
    }
    getAllRoutineTasks();
    return;
  }, [routineTasks.length]);

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
      <p>Routine Tasks:</p>
      <div class="flex flex-col gap-4">
        {tasks.map((task) => (
          task.type === "routine" ? (
            <div className="flex justify-around basis-2/3 h-10 w-150 rounded-sm border border-black-600 shadow-md">
              <div className="text-left align-middle">
                {routineTasks.name}
              </div>

              {daysofWeek.map((day) => (
                <div class="flex items-stretch  gap-2 justify-items-center">
                  <div>
                    {day}
                  </div>
                  <div class="self-end">
                    <input type="checkbox" />
                  </div>
                </div>
              ))}

              <div class="basis-6 self-end">
                <img src="/remove.png" alt="Remove Sign"></img>
              </div>
            </div>
          ) : (null)

        ))}
      </div>
    </>
  );
}

