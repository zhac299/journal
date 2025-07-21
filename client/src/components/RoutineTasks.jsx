import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RoutineTasks() {
  const daysofWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const endpoint = "http://localhost:5050/tasks/"

  var [routineTasks, setRoutineTasks] = useState([]);
  

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

  return (
    <>
      <p className="text-left">Routine Tasks:</p>
      <div className="flex flex-col gap-4">
        {routineTasks.map((routineTask) => (
          <div className="flex justify-around rounded-sm border border-gray-400 shadow-md">
            <div className="text-left min-w-30 max-w-30 place-self-center text-nowrap">
              {routineTask.name}
            </div>
            <div>
              <div className="columns-1">
                <p>Done?</p>
                <input className="checked:accent-green-500/25" type="checkbox" />
              </div>
            </div>
            <div className="columns-7">
              {daysofWeek.map((day) => (
                <div className="gap-2 justify-items-center">
                  <div>
                    {day}
                  </div>
                    <input className="checked:accent-green-500/25" type="checkbox" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

