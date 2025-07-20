import { useState, useEffect } from "react";

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { OtherTasks } from './OtherTasks'

export const ContentHolder = ({ tasks }) => {
    // Pass array of IDs to SortableContext
    const taskIds = tasks.map(task => task._id);

    return (
        <div className='content-holder'>
            <p class="text-left">Other:</p>
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                <div class="flex flex-col gap-4">
                    {tasks.map((task) => (
                        <OtherTasks _id={task._id.toString()} name={task.name} key={task._id} />
                    ))}
                </div>
            </SortableContext>
        </div>
    )
}