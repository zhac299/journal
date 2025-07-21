import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export const WIP = ({ _id, name }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: _id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  return (
    <>
      <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="flex justify-around basis-2/3 h-5 w-125 rounded-sm border border-gray-400 shadow-md">
        <div class="text-left min-w-30 max-w-30 place-self-center text-nowrap">
          {name}
        </div>
        <div>
          <div class="columns-1 self-end">
            <input class="checked:accent-green-500/25" type="checkbox" />
          </div>
        </div>
      </div>
    </>
  );
}