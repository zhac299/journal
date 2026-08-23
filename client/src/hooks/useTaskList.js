import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { endpoint } from "../App";

export function useTaskList(typeSuffix) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(endpoint + typeSuffix);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks for ${typeSuffix}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [typeSuffix]);

  const taskIds = tasks.map((task) => task._id);

  const getTaskPos = (id) => tasks.findIndex((task) => task._id === id);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over.id);
    const newOrder = arrayMove(tasks, originalPos, newPos);

    // Optimistic update
    setTasks(newOrder);

    try {
      const response = await fetch(`${endpoint}updatePositions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: newOrder.map((task, index) => ({
            id: task._id,
            position: index,
          })),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update positions");
      }
    } catch (err) {
      console.error("Failed to update positions, reverting:", err);
      // Revert state
      setTasks(tasks);
    }
  };

  // Helper to append a task to the local state
  const addTaskState = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  // Helper to remove a task from local state
  const removeTaskState = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  // Helper to update a task in local state
  const updateTaskState = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  return {
    tasks,
    taskIds,
    setTasks,
    fetchTasks,
    handleDragEnd,
    addTaskState,
    removeTaskState,
    updateTaskState,
  };
}
