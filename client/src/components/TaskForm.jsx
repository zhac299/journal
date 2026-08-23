import { useState, useEffect } from "react";

export default function TaskForm({ onSubmit, onCancel, initialValues, mode = "create" }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("wip");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setType(initialValues.type || "wip");
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Task name cannot be empty");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), type });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="task-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Task Name
        </label>
        <input
          id="task-name"
          type="text"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3.5 py-2.5 text-base sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Do daily pushups"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="task-type" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Category
        </label>
        <select
          id="task-type"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3.5 py-2.5 text-base sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="routine">Routine Task</option>
          <option value="wip">WIP (Work in Progress)</option>
          <option value="other">Other / Backlog</option>
        </select>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors focus:outline-none cursor-pointer text-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-center"
        >
          {mode === "create" ? "Create Task" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
