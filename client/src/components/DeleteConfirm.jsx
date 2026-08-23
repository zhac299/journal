export default function DeleteConfirm({ taskName, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-700 dark:text-slate-300">
        Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-slate-100">"{taskName}"</span>? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
        >
          Delete Task
        </button>
      </div>
    </div>
  );
}
