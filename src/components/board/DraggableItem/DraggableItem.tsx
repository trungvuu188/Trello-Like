import type { Item } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, X } from "lucide-react";

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
            className={`
                select-none bg-[#222f44] p-3 rounded-lg 
                shadow-sm cursor-grab hover:shadow-md 
                transition-shadow group 
                border border-transparent
                hover:border-white
                ${isDragging ? 'opacity-50' : ''
            }`}
        >
            <div className="flex justify-between items-start">
                {/* URL Preview Display */}
                {item.urlPreview ? (
                    <div className="space-y-3">
                        {/* URL Preview Card */}
                        <div className="border border-[#394B59] rounded-lg overflow-hidden bg-[#1a1e23] hover:border-[#4A90E2] transition-colors">
                            <a 
                                href={item.urlPreview.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block"
                                onClick={(e) => e.stopPropagation()} // Prevent drag when clicking link
                            >
                                {item.urlPreview.image && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img 
                                            src={item.urlPreview.image} 
                                            alt={item.urlPreview.title || 'Preview image'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const img = e.target as HTMLImageElement;
                                                img.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                
                                <div className="p-3">
                                    {item.urlPreview.siteName && (
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                            {item.urlPreview.favicon && (
                                                <img 
                                                    src={item.urlPreview.favicon} 
                                                    alt="" 
                                                    className="w-4 h-4"
                                                    onError={(e) => {
                                                        const img = e.target as HTMLImageElement;
                                                        img.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <span>{item.urlPreview.siteName}</span>
                                        </div>
                                    )}
                                    
                                    {item.urlPreview.title && (
                                        <h3 className="text-[#B6C2CF] font-medium text-sm mb-1 line-clamp-2">
                                            {item.urlPreview.title}
                                        </h3>
                                    )}
                                    
                                    {item.urlPreview.description && (
                                        <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                                            {item.urlPreview.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center gap-1 text-xs text-blue-400">
                                        <ExternalLink size={12} />
                                        <span className="truncate">
                                            {new URL(item.urlPreview.url).hostname}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        
                        {/* Text content if any (excluding the URL) */}
                        {item.content && !item.content.includes(item.urlPreview.url) && (
                            <div className="text-[#B6C2CF] text-sm whitespace-pre-wrap">
                                {item.content}
                            </div>
                        )}
                    </div>
                ) : (
                    <span className="text-sm text-[#B6C2CF] flex-1">{item.content}</span>
                )}
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
