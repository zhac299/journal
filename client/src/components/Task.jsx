import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import { endpoint } from "../App";

export const Task = ({ _id, name, type, done, routine }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: _id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [isDone, setIsDone] = useState(done);
  const [routineState, setRoutineState] = useState(routine || {});

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const handleDoneToggle = async () => {
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

  const handleDayToggle = async (dayKey) => {
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

  return (
    <>
      {type === "routine" ? (
        <div
          ref={setNodeRef}
          style={style}
          className="flex justify-around rounded-sm border border-gray-400 shadow-md cursor-grab"
          {...attributes}
          {...listeners}
        >
          <div
            className="text-left min-w-30 max-w-30 place-self-center text-nowrap"
          >
            {name}
          </div>
          {/* Checkbox area - NOT draggable, clicks work normally */}
          <div className="columns-1">
            <p>Done?</p>
            <input
              className="checked:accent-green-500/25"
              type="checkbox"
              checked={isDone}
              onChange={handleDoneToggle}
            />
          </div>
          <div className="columns-7">
            {daysOfWeek.map((day, index) => {
              const key = dayKeys[index];
              return (
                <div className="gap-2 justify-items-center" key={index}>
                  <div>{day}</div>
                  <input
                    className="checked:accent-green-500/25"
                    type="checkbox"
                    checked={!!routineState[key]}
                    onChange={() => handleDayToggle(key)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          ref={setNodeRef}
          style={style}
          className="flex justify-around basis-2/3 h-5 w-125 rounded-sm border border-gray-400 shadow-md cursor-grab"
          {...attributes}
          {...listeners}
        >
          {type === "wip" ? (
            <>
              <div
                className="text-left min-w-30 max-w-30 place-self-center text-nowrap"
              >
                {name}
              </div>
              <div className="columns-1 self-end">
                <input
                  className="checked:accent-green-500/25"
                  type="checkbox"
                  checked={isDone}
                  onChange={handleDoneToggle}
                />
              </div>
            </>
          ) : (
            <div>
              {name}
            </div>
          )}
        </div>
      )}
    </>
  );
};