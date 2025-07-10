import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RoutineTasks() {
  const daysofWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const endpoint = "http://localhost:5050/tasks/"

  var [routineTasks, setRoutineTasks] = useState([]);
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
          <div class="flex justify-around rounded-sm border border-gray-400 shadow-md">
            <div class="text-left min-w-30 max-w-30 place-self-center">
              {routineTask.name}
            </div>
            <div>
              <div class="columns-1">
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
                    <input type="checkbox" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

