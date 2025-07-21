import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { OtherTasks } from './OtherTasks'
import { WIP } from "./WIP";

export const ContentHolder = ({ nWIPTasks, WIPTasks }) => {
    // Pass array of IDs to SortableContext
    var nWIPtaskIds = nWIPTasks.map(task => task._id);
    var WIPtaskIds = WIPTasks.map(task => task._id);

    return (
        <>
            <div className='grid grid-cols-2'>
                <div>
                    <p className="text-justify indent-55">Other</p>
                    <br></br>
                    <SortableContext items={nWIPtaskIds} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col col-start-1 col-end-1 gap-4">
                            {nWIPTasks.map((task) => (
                                <OtherTasks _id={task._id.toString()} name={task.name} key={task._id} />
                            ))}
                        </div>
                    </SortableContext>
                </div>

                <div>
                    <p className="text-justify indent-55">WIP</p>
                    <br></br>
                    <SortableContext items={WIPtaskIds} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col col-start-2 col-end-2 gap-4">
                            {WIPTasks.map((task) => (
                                <WIP _id={task._id.toString()} name={task.name} key={task._id} />
                            ))}
                        </div>
                    </SortableContext>
                </div>
            </div>
        </>
    )
}