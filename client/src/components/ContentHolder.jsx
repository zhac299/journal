import { useState, useEffect } from 'react'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Task } from "./Task";

export default function ContentHolder() {
    const endpoint = "http://localhost:5050/tasks/"

    var [otherNWIPTasks, setOtherNWIPTasks] = useState([]);
    var [otherWIPTasks, setOtherWIPTasks] = useState([]);

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
    }, [otherNWIPTasks.length]);

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
    }, [otherWIPTasks.length]);

    // Pass array of IDs to SortableContext
    var nWIPtaskIds = otherNWIPTasks.map(task => task._id);
    var WIPtaskIds = otherWIPTasks.map(task => task._id);

    return (
        <>
            <div className='grid grid-cols-2'>
                <div>
                    <p className="text-justify indent-55">Other:</p>
                    <br></br>
                    <SortableContext items={nWIPtaskIds} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col col-start-1 col-end-1 gap-4">
                            {otherNWIPTasks.map((task) => (
                                <Task _id={task._id.toString()} name={task.name} type={task.type} key={task._id} />
                            ))}
                        </div>
                    </SortableContext>
                </div>

                <div>
                    <p className="text-justify indent-55">WIP:</p>
                    <br></br>
                    <SortableContext items={WIPtaskIds} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col col-start-2 col-end-2 gap-4">
                            {otherWIPTasks.map((task) => (
                                <Task _id={task._id.toString()} name={task.name} type={task.type} key={task._id} />
                            ))}
                        </div>
                    </SortableContext>
                </div>
            </div>
        </>
    )
}