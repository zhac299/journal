import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Task() {
  const daysofWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const endpoint = "http://localhost:5050/tasks/"

  var [routineTasks, setRoutineTasks] = useState([]);
  var [otherWIPTasks, setOtherWIPTasks] = useState([]);
  var [otherNWIPTasks, setOtherNWIPTasks] = useState([]);

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
      <p class="text-left">Routine Tasks:</p>
      <div class="flex flex-col gap-4">
        {routineTasks.map((routineTask) => (
          <div class="flex justify-around basis-2/3 h-5 w-150 rounded-sm border border-gray-400 shadow-md">
            <div class="text-left align-middle items-start min-w-30 max-w-30 place-self-center">
              {routineTask.name}
            </div>
            <div>
              <div class="columns-1 self-end">
                <p>Done?</p>
                <input type="checkbox" />
              </div>
            </div>
            <div class="columns-7">
              {daysofWeek.map((day) => (
                <div class="gap-2 justify-items-center">
                  <div>
                    {day}
                  </div>
                  <div class="self-end">
                    <input type="checkbox" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

