import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";

import { endpoint } from "../App";

export const Task = ({ _id, name, type, done, routine, onEdit, onDelete, onOpenActions }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: _id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [isDone, setIsDone] = useState(done);
  const [routineState, setRoutineState] = useState(routine || {});
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsDone(done);
  }, [done]);

  useEffect(() => {
    setRoutineState(routine || {});
  }, [routine]);

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    );
  }, []);

  const handleDoneToggle = async (e) => {
    e.stopPropagation();
    const newDone = !isDone;
    setIsDone(newDone);
    try {
      const response = await fetch(`${endpoint}${_id}/done`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone }),
      });
      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch (err) {
      console.error("Error toggling done:", err);
      setIsDone(!newDone); // revert on failure
    }
  };

  const handleDayToggle = async (dayKey, e) => {
    e.stopPropagation();
    const newValue = !routineState[dayKey];
    setRoutineState((prev) => ({ ...prev, [dayKey]: newValue }));
    try {
      const response = await fetch(`${endpoint}${_id}/routine`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: dayKey, value: newValue }),
      });
      if (!response.ok) {
        throw new Error("Failed to update routine");
      }
    } catch (err) {
      console.error("Error toggling routine day:", err);
      setRoutineState((prev) => ({ ...prev, [dayKey]: !newValue })); // revert
    }
  };

  const actions = (
    <div 
      className="flex items-center space-x-1 pl-2" 
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {isTouchDevice ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenActions && onOpenActions({ _id, name, type });
          }}
          className="text-gray-500 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          title="Task Options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
          </svg>
        </button>
      ) : (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit({ _id, name, type });
            }}
            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            title="Edit Task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete({ _id, name, type });
            }}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <>
      {type === "routine" ? (
        <div
          ref={setNodeRef}
          style={style}
          className="group flex justify-between items-center rounded-md border border-gray-300 shadow-sm cursor-grab bg-white p-3 hover:border-gray-400 transition-all select-none gap-4"
          {...attributes}
          {...listeners}
        >
          <div className="text-left font-semibold text-gray-800 truncate flex-1">
            {name}
          </div>
          {/* Checkbox area - NOT draggable, clicks work normally */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4" onPointerDown={(e) => e.stopPropagation()}>
            <span className="text-xs text-gray-500 font-medium">Done?</span>
            <input
              className="checked:accent-green-500 h-5 w-5 rounded cursor-pointer"
              type="checkbox"
              checked={isDone}
              onChange={handleDoneToggle}
            />
          </div>
          <div className="flex items-center space-x-3 border-l border-gray-200 pl-4" onPointerDown={(e) => e.stopPropagation()}>
            {daysOfWeek.map((day, index) => {
              const key = dayKeys[index];
              return (
                <div className="flex flex-col items-center" key={index}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{day}</span>
                  <input
                    className="checked:accent-green-500 h-4 w-4 rounded cursor-pointer"
                    type="checkbox"
                    checked={!!routineState[key]}
                    onChange={(e) => handleDayToggle(key, e)}
                  />
                </div>
              );
            })}
          </div>
          {actions}
        </div>
      ) : (
        <div
          ref={setNodeRef}
          style={style}
          className="group flex justify-between items-center w-full max-w-125 min-h-12 rounded-md border border-gray-300 shadow-sm cursor-grab bg-white py-2.5 px-4 hover:border-gray-400 transition-all select-none"
          {...attributes}
          {...listeners}
        >
          <div className="text-left font-semibold text-gray-800 truncate flex-1 pr-2">
            {name}
          </div>
          {type === "wip" && (
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4 mr-2" onPointerDown={(e) => e.stopPropagation()}>
              <input
                className="checked:accent-green-500 h-5 w-5 rounded cursor-pointer"
                type="checkbox"
                checked={isDone}
                onChange={handleDoneToggle}
              />
            </div>
          )}
          {actions}
        </div>
      )}
    </>
  );
};