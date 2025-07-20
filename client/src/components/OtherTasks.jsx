import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function WIP() {
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
      <p class="text-left">Other:</p>
      <div class="flex flex-col gap-4">
        {otherNWIPTasks.map((otherNWIPTask) => (
          <div class="flex justify-around basis-2/3 h-5 w-125 rounded-sm border border-gray-400 shadow-md">
            <div class="text-left min-w-30 max-w-30 place-self-center text-nowrap">
              {otherNWIPTask.name}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}