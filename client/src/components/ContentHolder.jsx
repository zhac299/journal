import { useState } from 'react';
import { closestCorners, DndContext, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

import { Task } from "./Task";
import { useTaskList } from "../hooks/useTaskList";
import { endpoint } from "../App";

import Modal from "./Modal";
import TaskForm from "./TaskForm";
import DeleteConfirm from "./DeleteConfirm";

// Custom droppable column helper to register empty lists as drop zones
function DroppableColumn({ id, children, className }) {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={className}>
            {children}
        </div>
    );
}

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

            toast.success("Task created successfully");
            closeModal();
        } catch (err) {
            console.error("Error creating task:", err);
            toast.error("Failed to create task");
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

            toast.success("Task updated");
            closeModal();
        } catch (err) {
            console.error("Error editing task:", err);
            toast.error("Failed to update task");
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

            toast.success("Task deleted");
            closeModal();
        } catch (err) {
            console.error("Error deleting task:", err);
            toast.error("Failed to delete task");
        }
    };

    // Unified Drag End handler for sorting and cross-container drops
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // 1. Identify source container
        let sourceContainer = null;
        let activeTask = null;

        if (routineHook.taskIds.includes(activeId)) {
            sourceContainer = "routine";
            activeTask = routineHook.tasks.find(t => t._id === activeId);
        } else if (wipHook.taskIds.includes(activeId)) {
            sourceContainer = "wip";
            activeTask = wipHook.tasks.find(t => t._id === activeId);
        } else if (otherHook.taskIds.includes(activeId)) {
            sourceContainer = "other";
            activeTask = otherHook.tasks.find(t => t._id === activeId);
        }

        if (!sourceContainer || !activeTask) return;

        // 2. Identify target container
        let targetContainer = null;

        if (overId === "routine" || routineHook.taskIds.includes(overId)) {
            targetContainer = "routine";
        } else if (overId === "wip" || wipHook.taskIds.includes(overId)) {
            targetContainer = "wip";
        } else if (overId === "other" || otherHook.taskIds.includes(overId)) {
            targetContainer = "other";
        }

        if (!targetContainer) return;

        // Case A: Dragged within the same container
        if (sourceContainer === targetContainer) {
            if (sourceContainer === "routine") {
                routineHook.handleDragEnd(event);
            } else if (sourceContainer === "wip") {
                wipHook.handleDragEnd(event);
            } else if (sourceContainer === "other") {
                otherHook.handleDragEnd(event);
            }
            return;
        }

        // Case B: Dragged across containers (Other <--> WIP <--> Routine)
        try {
            // Optimistic update of local states to prevent layout flicker
            if (sourceContainer === "routine") routineHook.removeTaskState(activeId);
            else if (sourceContainer === "wip") wipHook.removeTaskState(activeId);
            else otherHook.removeTaskState(activeId);

            const updatedTask = { ...activeTask, type: targetContainer };
            if (targetContainer === "routine") {
                updatedTask.routine = updatedTask.routine || {
                    monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false
                };
                routineHook.addTaskState(updatedTask);
            } else if (targetContainer === "wip") {
                delete updatedTask.routine;
                wipHook.addTaskState(updatedTask);
            } else {
                delete updatedTask.routine;
                otherHook.addTaskState(updatedTask);
            }

            // Sync with backend API
            const response = await fetch(`${endpoint}${activeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: targetContainer }),
            });
            if (!response.ok) throw new Error("Failed to update type on server");

            const containerNames = {
                routine: "Routine Tasks",
                wip: "WIP (Work In Progress)",
                other: "Other (Backlog)"
            };
            toast.success(`Moved "${activeTask.name}" to ${containerNames[targetContainer]}`);

            // Fetch to ensure correct sorting index order
            if (targetContainer === "routine") routineHook.fetchTasks();
            else if (targetContainer === "wip") wipHook.fetchTasks();
            else otherHook.fetchTasks();

        } catch (err) {
            console.error("Error moving task across containers:", err);
            toast.error("Failed to move task");
            // Revert state
            routineHook.fetchTasks();
            wipHook.fetchTasks();
            otherHook.fetchTasks();
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
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="max-w-4xl mx-auto py-6">
                
                {/* Routine Tasks Card Board */}
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 border-t-4 border-t-purple-500">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-lg uppercase tracking-wide flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                            Routine Tasks
                        </p>
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
                    <SortableContext items={routineHook.taskIds} strategy={verticalListSortingStrategy}>
                        <DroppableColumn id="routine" className="flex flex-col gap-3 min-h-[70px]">
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
                                <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-6">No routine tasks yet. Add one above!</p>
                            )}
                        </DroppableColumn>
                    </SortableContext>
                </div>

                {/* Other and WIP Grid columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Other (Backlog) Column Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-t-4 border-t-blue-500">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-lg uppercase tracking-wide flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                Other (Backlog)
                            </p>
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
                        <SortableContext items={otherHook.taskIds} strategy={verticalListSortingStrategy}>
                            <DroppableColumn id="other" className="flex flex-col gap-3 min-h-[120px]">
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
                                    <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-10">No tasks in backlog.</p>
                                )}
                            </DroppableColumn>
                        </SortableContext>
                    </div>

                    {/* WIP Column Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-t-4 border-t-emerald-500">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-lg uppercase tracking-wide flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                WIP (Work In Progress)
                            </p>
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
                        <SortableContext items={wipHook.taskIds} strategy={verticalListSortingStrategy}>
                            <DroppableColumn id="wip" className="flex flex-col gap-3 min-h-[120px]">
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
                                    <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-10">No tasks in progress.</p>
                                )}
                            </DroppableColumn>
                        </SortableContext>
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
                        <p className="font-semibold text-slate-700 dark:text-slate-300 text-lg border-b border-slate-100 dark:border-slate-700 pb-3 truncate max-w-full">
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
                            className="w-full py-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-md transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            </div>
        </DndContext>
    );
}