import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { endpoint } from "../App";

export const Task = ({ _id, name, type, done, cancelled, routine, onEdit, onDelete, onOpenActions }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: _id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [isDone, setIsDone] = useState(done);
  const [isCancelled, setIsCancelled] = useState(cancelled || false);
  const [routineState, setRoutineState] = useState(routine || {});
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsDone(done);
  }, [done]);

  useEffect(() => {
    setIsCancelled(cancelled || false);
  }, [cancelled]);

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
    if (newDone && isCancelled) {
      setIsCancelled(false);
    }
    try {
      const response = await fetch(`${endpoint}${_id}/done`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone }),
      });
      if (!response.ok) {
        throw new Error("Failed to update");
      }
      toast.success(newDone ? "Task completed" : "Task marked incomplete");
    } catch (err) {
      console.error("Error toggling done:", err);
      setIsDone(!newDone); // revert on failure
      toast.error("Failed to update status");
    }
  };

  const handleCancelToggle = async (e) => {
    e.stopPropagation();
    const newCancelled = !isCancelled;
    setIsCancelled(newCancelled);
    if (newCancelled && isDone) {
      setIsDone(false);
    }
    try {
      const response = await fetch(`${endpoint}${_id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelled: newCancelled }),
      });
      if (!response.ok) {
        throw new Error("Failed to update");
      }
      toast.success(newCancelled ? "Task cancelled" : "Task restored");
    } catch (err) {
      console.error("Error toggling cancel:", err);
      setIsCancelled(!newCancelled); // revert on failure
      toast.error("Failed to update status");
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
            onOpenActions && onOpenActions({ _id, name, type, done, cancelled });
          }}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
              onEdit && onEdit({ _id, name, type, done, cancelled });
            }}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Edit Task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete({ _id, name, type, done, cancelled });
            }}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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

  // Styles for completed or cancelled tasks
  const isCompleted = isDone;

  const containerClasses = type === "routine"
    ? `group flex justify-between items-center rounded-lg border shadow-2xs cursor-grab p-3 transition-all select-none gap-4
       ${isCompleted 
         ? "bg-slate-100/70 dark:bg-slate-800/40 opacity-60 border-slate-200 dark:border-slate-800" 
         : "bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-800/90"
       }`
    : `group flex justify-between items-center w-full max-w-125 min-h-12 rounded-lg border shadow-2xs cursor-grab py-2.5 px-4 transition-all select-none
       ${type === "wip" && isDone 
         ? "bg-emerald-50/40 dark:bg-slate-800/40 opacity-60 border-emerald-200/50 dark:border-slate-800"
         : type === "wip" && isCancelled
         ? "bg-rose-50/40 dark:bg-slate-800/40 opacity-60 border-rose-200/50 dark:border-slate-800"
         : "bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-800/90"
       }`;

  const nameClasses = (type === "wip" || type === "routine") && isDone
    ? "text-left font-medium text-slate-400 dark:text-slate-500 line-through truncate flex-1 pr-2"
    : type === "wip" && isCancelled
    ? "text-left font-medium text-rose-500/80 dark:text-rose-400/80 line-through truncate flex-1 pr-2"
    : "text-left font-medium text-slate-800 dark:text-slate-100 truncate flex-1 pr-2";

  return (
    <>
      {type === "routine" ? (
        <div
          ref={setNodeRef}
          style={style}
          className={containerClasses}
          {...attributes}
          {...listeners}
        >
          <div className={nameClasses}>
            {name}
          </div>
          {/* Checkbox area - NOT draggable, clicks work normally */}
          <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-4" onPointerDown={(e) => e.stopPropagation()}>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Done?</span>
            <input
              className="checked:accent-emerald-500 h-5 w-5 rounded cursor-pointer"
              type="checkbox"
              checked={isDone}
              onChange={handleDoneToggle}
            />
          </div>
          <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4" onPointerDown={(e) => e.stopPropagation()}>
            {daysOfWeek.map((day, index) => {
              const key = dayKeys[index];
              return (
                <div className="flex flex-col items-center" key={index}>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-0.5">{day}</span>
                  <input
                    className="checked:accent-emerald-500 h-4 w-4 rounded cursor-pointer"
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
          className={containerClasses}
          {...attributes}
          {...listeners}
        >
          <div className={nameClasses}>
            {name}
          </div>
          {type === "wip" && (
            <div className="flex items-center space-x-1.5 border-l border-slate-200 dark:border-slate-700 pl-3 mr-1" onPointerDown={(e) => e.stopPropagation()}>
              {/* Complete Check Button */}
              <button
                type="button"
                onClick={handleDoneToggle}
                className={`p-1 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                  isDone
                    ? "text-emerald-600 bg-emerald-100/90 dark:text-emerald-400 dark:bg-emerald-950/60 ring-1 ring-emerald-500/30"
                    : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                }`}
                title={isDone ? "Mark as incomplete" : "Mark as completed"}
                aria-label="Complete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Cancel / Cross-out Button */}
              <button
                type="button"
                onClick={handleCancelToggle}
                className={`p-1 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                  isCancelled
                    ? "text-rose-600 bg-rose-100/90 dark:text-rose-400 dark:bg-rose-950/60 ring-1 ring-rose-500/30"
                    : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                }`}
                title={isCancelled ? "Restore task" : "Cancel / Cross out task"}
                aria-label="Cancel task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          )}
          {actions}
        </div>
      )}
    </>
  );
};