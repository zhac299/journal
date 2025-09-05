import { useState, useEffect } from 'react'

import { closestCorners, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Task } from "./Task";

import { endpoint } from "../App";

export default function ContentHolder() {
    

    var [otherNWIPTasks, setOtherNWIPTasks] = useState([]);
    var [otherWIPTasks, setOtherWIPTasks] = useState([]);
    var [routineTasks, setRoutineTasks] = useState([]);

    useEffect(() => {
        async function getAllOtherNWIPTasks() {
            const response = await fetch(endpoint + "other/nwip");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            let other = await response.json();
            setOtherNWIPTasks(other);
            console.log(other);
        }
        getAllOtherNWIPTasks();
        return
    }, []);

    useEffect(() => {
        async function getAllOtherWIPTasks() {
            const response = await fetch(endpoint + "other/wip");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            let other = await response.json();
            setOtherWIPTasks(other);
            console.log(other);
        }
        getAllOtherWIPTasks();
        return;
    }, []);

    useEffect(() => {
        async function getAllRoutineTasks() {
            const response = await fetch(endpoint + "routine");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            let routine = await response.json();
            setRoutineTasks(routine);
            console.log(routine);
        }
        getAllRoutineTasks();
        return;
    }, []);

    // Pass array of IDs to SortableContext
    var nWIPtaskIds = otherNWIPTasks.map(task => task._id);
    var WIPtaskIds = otherWIPTasks.map(task => task._id);
    var routineTaskIds = routineTasks.map(task => task._id);

    const getRoutineTaskPos = id => routineTasks.findIndex(task => task._id === id);
    const getOtherTaskPos = id => otherNWIPTasks.findIndex(task => task._id === id);
    const getWIPTaskPos = id => otherWIPTasks.findIndex(task => task._id === id);

    const handleDragEndRoutine = (event) => {
        const { active, over } = event;

        if (active.id === over.id) return;

        setRoutineTasks((routineTasks) => {
            const originalPos = getRoutineTaskPos(active.id);
            const newPos = getRoutineTaskPos(over.id)

            return arrayMove(routineTasks, originalPos, newPos)
        })
    }

    const handleDragEndOther = (event) => {
        const { active, over } = event;

        if (active.id === over.id) return;

        setOtherNWIPTasks((otherNWIPTasks) => {
            const originalPos = getOtherTaskPos(active.id);
            const newPos = getOtherTaskPos(over.id)

            return arrayMove(otherNWIPTasks, originalPos, newPos)
        })
    }

    const handleDragEndWIP = (event) => {
        const { active, over } = event;

        if (active.id === over.id) return;

        setOtherWIPTasks((otherWIPTasks) => {
            const originalPos = getWIPTaskPos(active.id);
            const newPos = getWIPTaskPos(over.id)

            return arrayMove(otherWIPTasks, originalPos, newPos)
        })
    }

    return (
        <>

            <p className="text-left">Routine Tasks:</p>
            <br></br>
            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEndRoutine}>
                <SortableContext items={routineTaskIds} strategy={verticalListSortingStrategy}>

                    <div className="flex flex-col gap-4">
                        {routineTasks.map((task) => (
                            <Task _id={task._id.toString()} name={task.name} type={task.type} key={task._id} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <br></br>
            <div className='grid grid-cols-2'>
                <div>
                    <p className="text-justify indent-55">Other:</p>
                    <br></br>
                    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEndOther}>
                        <SortableContext items={nWIPtaskIds} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col col-start-1 col-end-1 gap-4">
                                {otherNWIPTasks.map((task) => (
                                    <Task _id={task._id.toString()} name={task.name} type={task.type} key={task._id} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                <div>
                    <p className="text-justify indent-55">WIP:</p>
                    <br></br>
                    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEndWIP}>

                        <SortableContext items={WIPtaskIds} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col col-start-2 col-end-2 gap-4">
                                {otherWIPTasks.map((task) => (
                                    <Task _id={task._id.toString()} name={task.name} type={task.type} key={task._id} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                </div>
            </div>
        </>
    )
}