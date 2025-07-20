import { DndContext } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core';

export default function ContentHolder() {

    function droppable(props) {
        const { setNodeRef } = useDroppable({
            id: 'droppable-1',
        });
    }

    return (
        <>
            <DndContext>
                <section>
                    <div ref={setNodeRef}>

                    </div>
                </section>
            </DndContext>
        </>
    );
}