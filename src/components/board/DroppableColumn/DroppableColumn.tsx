import type { Column, Item } from "@/types";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X } from "lucide-react";
import DraggableItem from "../DraggableItem/DraggableItem";

interface DroppableColumnProps {
    column: Column;
    items: Item[];
    onAddItem: (columnId: string) => void;
    onDeleteItem: (itemId: string) => void;
    onDeleteColumn: (columnId: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
    column,
    items,
    onAddItem,
    onDeleteColumn,
    onDeleteItem
}) => {

    const { 
        attributes, listeners, 
        setNodeRef, transform, 
        transition, isDragging 
    } = useSortable({ 
        id: column.id, 
        data: { 
            type: 'column', 
            column 
        } 
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`select-none bg-[#101204] rounded-xl p-2 pr-1 w-[272px] flex-shrink-0 
                max-h-full flex flex-col
                ${isDragging ? 'opacity-50' : ''}`
            }
        >
            <div 
                {...attributes}
                {...listeners}
                className="flex-shrink-0 flex items-center justify-between cursor-grab p-2 pb-3"
            >
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#B6C2CF]">{column.title}</h3>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteColumn(column.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                    <X size={16} />
                </button>
            </div>
            <SortableContext
                items={items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="overflow-y-auto space-y-3 pr-1">
                    {
                        items.map(item => (
                            <DraggableItem key={item.id} item={item} onDelete={onDeleteItem}  />
                        ))
                    }
                </div>
            </SortableContext>
            
            <button
                onClick={() => onAddItem(column.id)}
                className="flex-shrink-0 w-full p-2 mt-3 text-[#B6C2CF] hover:text-[#B6C2CF] hover:bg-[#222f44] rounded-lg transition-colors flex items-center gap-2"
            >
                <Plus size={16} />
                Add a card
            </button>
        </div>
    );
}

export default DroppableColumn;
