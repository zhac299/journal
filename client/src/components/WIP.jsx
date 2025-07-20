import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function WIP() {
  const endpoint = "http://localhost:5050/tasks/"

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
      <p>WIP:</p>
      <div class="flex flex-col gap-4">
        {otherWIPTasks.map((otherWIPTask) => (
          <div class="flex justify-around basis-2/3 h-5 w-125 rounded-sm border border-gray-400 shadow-md">
            <div class="text-left min-w-30 max-w-30 place-self-center text-nowrap">
              {otherWIPTask.name}
            </div>
            <div>
              <div class="columns-1 self-end">
                <input class="checked:accent-green-500/25" type="checkbox" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}