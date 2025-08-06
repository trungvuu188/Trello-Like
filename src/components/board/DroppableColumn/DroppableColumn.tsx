import type { Column, Item } from "@/types";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X } from "lucide-react";
import DraggableItem from "../DraggableItem/DraggableItem";
import { useEffect, useRef, useState } from "react";
import UrlPreview from "../URLPreview/UrlPreview";

interface DroppableColumnProps {
    column: Column;
    items: Item[];
    isAddingCard: boolean;
    cardTitle: string;
    setCardTitle: (title: string) => void;
    onStartAddingCard: (columnId: string) => void;
    onSubmitCard: (columnId: string) => void;
    onCancelCard: () => void;
    onDeleteItem: (itemId: string) => void;
    onDeleteColumn: (columnId: string) => void;
    onUpdateColumnTitle: (columnId: string, newTitle: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
    column,
    items,
    isAddingCard,
    cardTitle,
    setCardTitle,
    onStartAddingCard,
    onSubmitCard,
    onCancelCard,
    onDeleteColumn,
    onDeleteItem,
    onUpdateColumnTitle
}) => {

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(column.title);
    const [detectedUrl, setDetectedUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const columnRef = useRef<HTMLDivElement>(null);

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
    };

    // URL detection regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const detectUrl = (text: string): string | null => {
        const matches = text.match(urlRegex);
        return matches ? matches[0] : null;
    };

    useEffect(() => {
        if (isAddingCard && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAddingCard]);

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
            titleInputRef.current.select();
        }
    }, [isEditingTitle]);

    useEffect(() => {
        setTitleValue(column.title);
    }, [column.title]);

    // Detect URLs in card title
    useEffect(() => {
        const url = detectUrl(cardTitle);
        setDetectedUrl(url);
    }, [cardTitle]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isEditingTitle && columnRef.current && !columnRef.current.contains(event.target as Node)) {
                handleTitleSubmit();
            }
        };

        if (isEditingTitle) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditingTitle, titleValue]);

    const handleAddCard = () => {
        // Close title editing when starting to add card
        if (isEditingTitle) {
            handleTitleSubmit();
        }
        onStartAddingCard(column.id);
    };

    const handleSubmit = () => {
        onSubmitCard(column.id);
        setDetectedUrl(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'Escape') {
            onCancelCard();
        }
    };

    const handleTitleClick = () => {
        // Close add card input if it's open
        if (isAddingCard) {
            onCancelCard();
        }
        setIsEditingTitle(true);
    };

    const handleTitleSubmit = () => {
        if (titleValue.trim() && titleValue.trim() !== column.title) {
            onUpdateColumnTitle(column.id, titleValue.trim());
        } else {
            setTitleValue(column.title); // Reset to original if empty or unchanged
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTitleSubmit();
        } else if (e.key === 'Escape') {
            setTitleValue(column.title); // Reset to original
            setIsEditingTitle(false);
        }
    };

    const handleRemoveUrlPreview = () => {
        setDetectedUrl(null);
        // Optionally remove the URL from the card title
        if (detectedUrl) {
            const newTitle = cardTitle.replace(detectedUrl, '').trim();
            setCardTitle(newTitle);
        }
    };

    // Prevent event bubbling to parent container when clicking inside the input area
    const handleInputAreaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

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
                ref={columnRef}
                {...attributes}
                {...listeners}
                className="flex-shrink-0 flex items-center justify-between gap-4 cursor-grab p-2 pb-3"
            >
                <div className="flex items-center gap-2 flex-1">
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            value={titleValue}
                            onChange={(e) => setTitleValue(e.target.value)}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={handleTitleSubmit}
                            className="font-semibold text-[#B6C2CF] bg-[#22272B] border border-[#394B59] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
                            onClick={(e) => e.stopPropagation()} // Prevent drag when clicking input
                        />
                    ) : (
                        <h3 
                            className="font-semibold text-[#B6C2CF] cursor-pointer hover:bg-[#22272B] rounded px-2 py-1 -mx-2 -my-1 transition-colors flex-1"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent drag when clicking title
                                handleTitleClick();
                            }}
                        >
                            {column.title}
                        </h3>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteColumn(column.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
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
            
            <div className="flex-shrink-0 mt-3">
                {isAddingCard ? (
                    <div className="space-y-2" onClick={handleInputAreaClick}>
                        {detectedUrl && (
                            <UrlPreview 
                                url={detectedUrl} 
                                onRemove={handleRemoveUrlPreview}
                                showRemoveButton={true}
                            />
                        )}

                        <textarea
                            ref={inputRef}
                            value={cardTitle}
                            onChange={(e) => setCardTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter a title or paste a link"
                            className="w-full p-2 text-sm bg-[#22272B] text-[#B6C2CF] border border-[#394B59] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSubmit}
                                disabled={!cardTitle.trim()}
                                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
                            >
                                Add card
                            </button>
                            <button
                                onClick={onCancelCard}
                                className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#22272B] rounded transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleAddCard}
                        className="w-full p-2 text-[#B6C2CF] hover:text-[#B6C2CF] hover:bg-[#222f44] rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add a card
                    </button>
                )}
            </div>
        </div>
    );
}

export default DroppableColumn;
