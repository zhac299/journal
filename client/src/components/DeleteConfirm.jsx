export default function DeleteConfirm({ taskName, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Are you sure you want to delete <span className="font-bold text-gray-900">"{taskName}"</span>? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Task
        </button>
      </div>
    </div>
  );
}
