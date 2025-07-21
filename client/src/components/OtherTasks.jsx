import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export const OtherTasks = ({ _id, name }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: _id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  return (
    <>
      <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="flex justify-around basis-2/3 h-5 w-125 rounded-sm border border-gray-400 shadow-md">
        {name}
      </div>
    </>
  );
}