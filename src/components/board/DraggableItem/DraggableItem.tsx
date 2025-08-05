import type { Item } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";

interface DraggableItemProps {
    item: Item,
    onDelete: (itemId: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
    item,
    onDelete
}) => {

    const {
        attributes, listeners,
        setNodeRef, transform,
        transition, isDragging
    } = useSortable({
        id: item.id,
        data: {
            type: 'item',
            item,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`select-none bg-[#222f44] p-3 rounded-lg shadow-sm cursor-grab hover:shadow-md transition-shadow group ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <div className="flex justify-between items-start">
                <span className="text-sm text-[#B6C2CF] flex-1">{item.content}</span>
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 ml-2"
                >
                <X size={14} />
                </button>
            </div>
        </div>
    );
}

export default DraggableItem;
