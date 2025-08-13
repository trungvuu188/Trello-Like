import type { Item } from '@/types';
import { detectUrl } from '@/utils/UrlPreviewUtils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import UrlPreview from './UrlPreview';

interface DraggableItemProps {
    item: Item;
    onDelete: (itemId: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        data: {
            type: 'item',
            item,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                select-none bg-[#222f44] p-3 rounded-lg 
                shadow-sm cursor-grab hover:shadow-md 
                transition-shadow group 
                border border-transparent
                hover:border-white
                relative
                ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className='flex flex-col items-start'>
                <button
                    onClick={e => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }}
                    className='
                        opacity-0 group-hover:opacity-100 
                        transition-opacity text-gray-400 
                        hover:text-red-500 ml-2
                        self-end p-1 bg-white rounded-full
                        cursor-pointer z-10
                        absolute top-1 right-1
                    '
                >
                    <X size={14} />
                </button>
                {/* URL Preview Display */}
                {detectUrl(item.content) ? (
                    <div className='space-y-3 w-full'>
                        <UrlPreview
                            isDragging={isDragging}
                            url={item.content}
                            showRemoveButton={false}
                        />
                    </div>
                ) : (
                    <span className='text-sm text-[#B6C2CF] flex-1 whitespace-pre-wrap break-all'>
                        {item.content}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DraggableItem;
