import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  // This method fetches the tasks from the database.
  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`http://localhost:5050/task/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const task = await response.json();
      setTasks(task);
    }
    getTasks();
    return;
  }, [task.length]);



  // This following section will display the table with the records of individuals.
  return (
    <>
    </>
  );
}