import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const daysofWeek = ["M", "T", "W", "T", "F", "S", "S"];

  useEffect(() => {
    // Fetch task data from the server
    async function getTasks() {
      const response = await fetch("https://journal-3uz1.onrender.com/tasks");
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      let tasks = await response.json();
      setTasks(tasks);
      console.log(tasks);
    }
    getTasks();
    return;
  }, [tasks.length]);

  return (
    <>
      <div class="flex flex-col gap-4">
        {tasks.map((task) => (
          task.type === "other" ? (
            <div className="flex justify-around basis-2/3 h-10 w-96 rounded-sm border border-black-600 shadow-md">
              <div className="text-left align-middle">
                {task.name}
              </div>

              <div class="self-center">
                <input type="checkbox" />
              </div>

              <div class="basis-6 self-end">
                <img src="/remove.png" alt="Remove Sign"></img>
              </div>
            </div>
          ) : (
            <div className="flex justify-around basis-2/3 h-10 w-150 rounded-sm border border-black-600 shadow-md">
              <div className="text-left align-middle">
                {task.name}
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
          )

        ))}
      </div>
    </>
  );
}