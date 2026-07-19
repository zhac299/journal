import { useState } from 'react';
import { closestCorners, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Task } from "./Task";
import { useTaskList } from "../hooks/useTaskList";
import { endpoint } from "../App";

import Modal from "./Modal";
import TaskForm from "./TaskForm";
import DeleteConfirm from "./DeleteConfirm";

export default function ContentHolder() {
    const routineHook = useTaskList("routine");
    const wipHook = useTaskList("other/wip");
    const otherHook = useTaskList("other/nwip");

    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: null, // "create" | "edit" | "delete" | "actions"
        task: null,
        defaultType: "wip"
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleCreateSubmit = async ({ name, type }) => {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, type }),
            });
            if (!response.ok) throw new Error("Failed to create task");
            
            // Refresh the appropriate list
            if (type === "routine") routineHook.fetchTasks();
            else if (type === "wip") wipHook.fetchTasks();
            else otherHook.fetchTasks();

            closeModal();
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    const handleEditSubmit = async ({ name, type }) => {
        const task = modalState.task;
        try {
            const response = await fetch(`${endpoint}${task._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, type }),
            });
            if (!response.ok) throw new Error("Failed to edit task");
            const updatedTask = await response.json();

            if (task.type !== type) {
                // Type changed: remove from old list and fetch new list
                if (task.type === "routine") routineHook.removeTaskState(task._id);
                else if (task.type === "wip") wipHook.removeTaskState(task._id);
                else otherHook.removeTaskState(task._id);

                if (type === "routine") routineHook.fetchTasks();
                else if (type === "wip") wipHook.fetchTasks();
                else otherHook.fetchTasks();
            } else {
                // Type remained same: update local state
                if (type === "routine") routineHook.updateTaskState(updatedTask);
                else if (type === "wip") wipHook.updateTaskState(updatedTask);
                else otherHook.updateTaskState(updatedTask);
            }

            closeModal();
        } catch (err) {
            console.error("Error editing task:", err);
        }
    };

    const handleDeleteConfirm = async () => {
        const task = modalState.task;
        try {
            const response = await fetch(`${endpoint}${task._id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete task");

            if (task.type === "routine") routineHook.removeTaskState(task._id);
            else if (task.type === "wip") wipHook.removeTaskState(task._id);
            else otherHook.removeTaskState(task._id);

            closeModal();
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    const openCreateModal = (defaultType) => {
        setModalState({
            isOpen: true,
            mode: "create",
            task: null,
            defaultType
        });
    };

    const openEditModal = (task) => {
        setModalState({
            isOpen: true,
            mode: "edit",
            task,
            defaultType: task.type
        });
    };

    const openDeleteModal = (task) => {
        setModalState({
            isOpen: true,
            mode: "delete",
            task,
            defaultType: task.type
        });
    };

    const openActionsModal = (task) => {
        setModalState({
            isOpen: true,
            mode: "actions",
            task,
            defaultType: task.type
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            mode: null,
            task: null,
            defaultType: "wip"
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Routine Tasks Section */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-xs mb-8">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                    <p className="font-bold text-gray-800 text-lg uppercase tracking-wide">Routine Tasks</p>
                    <button
                        onClick={() => openCreateModal("routine")}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-xs hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <span>Add Task</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={routineHook.handleDragEnd}>
                    <SortableContext items={routineHook.taskIds} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-3 min-h-[50px]">
                            {routineHook.tasks.map((task) => (
                                <Task 
                                    _id={task._id} 
                                    name={task.name} 
                                    type={task.type} 
                                    done={task.done} 
                                    routine={task.routine} 
                                    key={task._id}
                                    onEdit={openEditModal}
                                    onDelete={openDeleteModal}
                                    onOpenActions={openActionsModal}
                                />
                            ))}
                            {routineHook.tasks.length === 0 && (
                                <p className="text-gray-400 text-sm text-center py-4">No routine tasks yet. Add one above!</p>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Other and WIP Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Other (Backlog) Column */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-xs">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                        <p className="font-bold text-gray-800 text-lg uppercase tracking-wide">Other (Backlog)</p>
                        <button
                            onClick={() => openCreateModal("other")}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-xs hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <span>Add Task</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={otherHook.handleDragEnd}>
                        <SortableContext items={otherHook.taskIds} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-3 min-h-[50px]">
                                {otherHook.tasks.map((task) => (
                                    <Task 
                                        _id={task._id} 
                                        name={task.name} 
                                        type={task.type} 
                                        done={task.done} 
                                        routine={task.routine} 
                                        key={task._id}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                        onOpenActions={openActionsModal}
                                    />
                                ))}
                                {otherHook.tasks.length === 0 && (
                                    <p className="text-gray-400 text-sm text-center py-4">No tasks in backlog.</p>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                {/* WIP Column */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-xs">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                        <p className="font-bold text-gray-800 text-lg uppercase tracking-wide">WIP (Work In Progress)</p>
                        <button
                            onClick={() => openCreateModal("wip")}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-xs hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <span>Add Task</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={wipHook.handleDragEnd}>
                        <SortableContext items={wipHook.taskIds} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-3 min-h-[50px]">
                                {wipHook.tasks.map((task) => (
                                    <Task 
                                        _id={task._id} 
                                        name={task.name} 
                                        type={task.type} 
                                        done={task.done} 
                                        routine={task.routine} 
                                        key={task._id}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                        onOpenActions={openActionsModal}
                                    />
                                ))}
                                {wipHook.tasks.length === 0 && (
                                    <p className="text-gray-400 text-sm text-center py-4">No tasks in progress.</p>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            {/* Render appropriate Modals */}
            <Modal 
                isOpen={modalState.isOpen && modalState.mode === "create"} 
                onClose={closeModal} 
                title="Create Task"
            >
                <TaskForm 
                    mode="create" 
                    onSubmit={handleCreateSubmit} 
                    onCancel={closeModal}
                    initialValues={{ type: modalState.defaultType }}
                />
            </Modal>

            <Modal 
                isOpen={modalState.isOpen && modalState.mode === "edit"} 
                onClose={closeModal} 
                title="Edit Task"
            >
                <TaskForm 
                    mode="edit" 
                    onSubmit={handleEditSubmit} 
                    onCancel={closeModal} 
                    initialValues={modalState.task}
                />
            </Modal>

            <Modal 
                isOpen={modalState.isOpen && modalState.mode === "delete"} 
                onClose={closeModal} 
                title="Delete Task"
            >
                <DeleteConfirm 
                    taskName={modalState.task?.name || ""} 
                    onConfirm={handleDeleteConfirm} 
                    onCancel={closeModal}
                />
            </Modal>

            {/* Mobile Actions Menu Modal */}
            <Modal 
                isOpen={modalState.isOpen && modalState.mode === "actions"} 
                onClose={closeModal} 
                title="Manage Task"
            >
                <div className="space-y-3 pb-2 text-center">
                    <p className="font-semibold text-gray-700 text-lg border-b border-gray-100 pb-3 truncate max-w-full">
                        {modalState.task?.name}
                    </p>
                    <button
                        onClick={() => openEditModal(modalState.task)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                        Edit Task
                    </button>
                    <button
                        onClick={() => openDeleteModal(modalState.task)}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                        Delete Task
                    </button>
                    <button
                        onClick={closeModal}
                        className="w-full py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-md transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
}