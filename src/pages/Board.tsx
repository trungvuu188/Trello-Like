import DroppableColumn from "@/components/board/DroppableColumn/DroppableColumn";
import type { Column, Item } from "@/types";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, pointerWithin,  useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { GripVertical, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Board = () => {

    const [columns, setColumns] = useState<Column[]>([
        {
            id: 'col-1',
            title: 'Backlog',
            items: [
                { id: 'item-1', content: 'Design the new landing page' },
                { id: 'item-2', content: 'Set up database schema' },
                { id: 'item-3', content: 'Write API auth' },
            ]
        },
        {
            id: 'col-2',
            title: 'To do',
            items: [
                { id: 'item-4', content: 'Security config' },
                { id: 'item-5', content: 'Responsive for layout' },
            ]
        },
        {
            id: 'col-3',
            title: 'Process',
            items: [
                { id: 'item-6', content: 'Unit testing' },
                { id: 'item-7', content: 'CI/CD with Github Action' },
            ]
        },
    ]);

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const [activeInputColumnId, setActiveInputColumnId] = useState<string | null>(null);
    const [cardTitle, setCardTitle] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveInputColumnId(null);
                setCardTitle("");
            }
        };

        if (activeInputColumnId) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeInputColumnId]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);

        // Close any active input when starting drag
        setActiveInputColumnId(null);
        setCardTitle("");
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if(!over) return;

        const activeId = active.id;
        const overId = over.id;

        if(activeId === overId) return;

        const isActiveAnItem = active.data.current?.type === 'item';
        const isOverAnItem = over.data.current?.type === 'item';
        const isOverAColumn = over.data.current?.type === 'column';

        if(!isActiveAnItem) return;

        // Item over item (different column)
        if(isActiveAnItem && isOverAnItem) {
            setColumns(columns => {
                const activeColumnIndex = columns.findIndex(col => 
                    col.items.find(item => item.id === activeId)
                );
                const overColumnIndex = columns.findIndex(col => 
                    col.items.find(item => item.id === overId)
                );

                if(activeColumnIndex != overColumnIndex) {
                    const activeColumn = columns[activeColumnIndex];
                    const overColumn = columns[overColumnIndex];
                    const activeItemIndex = activeColumn.items.findIndex(item =>
                        item.id === activeId
                    );
                    const overItemIndex = overColumn.items.findIndex(item => 
                        item.id === overId
                    );

                    const [activeItem] = activeColumn.items.splice(activeItemIndex, 1);
                    overColumn.items.splice(overItemIndex, 0, activeItem);

                    return [...columns];
                }

                return columns;
            })
        }

        // Item over column
        if(isActiveAnItem && isOverAColumn) {
            setColumns(columns => {
                const activeColumnIndex = columns.findIndex(col => 
                    col.items.find(item => item.id === activeId)
                );
                const overColumnIndex = columns.findIndex(col =>
                    col.id === overId
                );
                if(activeColumnIndex !== overColumnIndex) {
                    const activeColumn = columns[activeColumnIndex];
                    const overColumn = columns[overColumnIndex];
                    const activeItemIndex = activeColumn.items.findIndex(item => 
                        item.id === activeId
                    );

                    const [activeItem] = activeColumn.items.splice(activeItemIndex, 1);
                    overColumn.items.push(activeItem);

                    return [...columns];
                }

                return columns;
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);

        if(!over) return;

        const activeId = active.id;
        const overId = over.id;

        const isActiveAColumn = active.data.current?.type === 'column';
        const isOverAColumn = over.data.current?.type === 'column';
        const isActiveAnItem = active.data.current?.type === 'item';
        const isOverAnItem = over.data.current?.type === 'item';

        if(isActiveAColumn && isOverAColumn) {
            setColumns(columns => {
                const activeColumnIndex = columns.findIndex(col =>
                    col.id === activeId
                );
                const overColumnIndex = columns.findIndex(col => 
                    col.id === overId
                );

                return arrayMove(columns, activeColumnIndex, overColumnIndex);
            });
        }

        if (isActiveAnItem && isOverAnItem) {
            setColumns(columns => {
                const activeColumnIndex = columns.findIndex(col => 
                    col.items.find(item => item.id === activeId)
                );
                const overColumnIndex = columns.findIndex(col => 
                    col.items.find(item => item.id === overId)
                );

                if (activeColumnIndex === overColumnIndex) {
                    const column = columns[activeColumnIndex];
                    const activeItemIndex = column.items.findIndex(item => 
                        item.id === activeId
                    );
                    const overItemIndex = column.items.findIndex(item => 
                        item.id === overId
                    );

                    column.items = arrayMove(column.items, activeItemIndex, overItemIndex);
                    return [...columns];
                }

                return columns;
            })
        }
    }

    const addColumn = () => {
        const newColumn: Column = {
        id: `col-${Date.now()}`,
        title: `New Column`,
        items: [],
        };
        setColumns([...columns, newColumn]);
    };

    const handleUpdateColumnTitle = (columnId: string, newTitle: string) => {
        setColumns((columns) =>
            columns.map((column) =>
                column.id === columnId
                    ? { ...column, title: newTitle }
                    : column
            )
        );
    };

    const deleteColumn = (columnId: string) => {
        setColumns((columns) => columns.filter((column) => column.id !== columnId));
        if (activeInputColumnId === columnId) {
            setActiveInputColumnId(null);
            setCardTitle("");
        }
    };

    const handleStartAddingCard = (columnId: string) => {
        setActiveInputColumnId(columnId);
        setCardTitle("");
    };

    const handleSubmitCard = async (columnId: string) => {
        if (cardTitle.trim()) {
            // Detect if there's a URL in the content
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const detectedUrl = cardTitle.match(urlRegex)?.[0];
            
            let urlPreviewData = null;
            
            // If URL is detected, fetch its preview
            if (detectedUrl) {
                try {
                    // Fetch URL preview (you can extract this to a separate function)
                    const response = await fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(detectedUrl)}`);
                    if (response.ok) {
                        const data = await response.json();
                        urlPreviewData = {
                            url: detectedUrl,
                            title: data.title || 'No title available',
                            description: data.description || '',
                            image: data.images?.[0] || data.image || '',
                            siteName: data.domain || new URL(detectedUrl).hostname,
                            favicon: data.favicon || `https://www.google.com/s2/favicons?domain=${new URL(detectedUrl).hostname}&sz=32`
                        };
                    }
                } catch (error) {
                    console.error('Failed to fetch URL preview:', error);
                }
            }

            const newItem: Item = {
                id: `item-${Date.now()}`,
                content: cardTitle.trim(),
                urlPreview: urlPreviewData || undefined
            };

            setColumns((columns) =>
                columns.map((column) =>
                column.id === columnId
                    ? { ...column, items: [...column.items, newItem] }
                    : column
                )
            );
        }
        setActiveInputColumnId(null);
        setCardTitle("");
    };

    const handleCancelCard = () => {
        setActiveInputColumnId(null);
        setCardTitle("");
    };

    const deleteItem = (itemId: string) => {
        setColumns((columns) =>
            columns.map((column) => ({
            ...column,
            items: column.items.filter((item) => item.id !== itemId),
            }))
        );
    };

    const activeColumn = columns.find(col => col.id === activeId)
    const activeItem = columns.flatMap(col => col.items)
                            .find(item => item.id === activeId)

    return (
        <div className="bg-[#283449] w-full h-full flex flex-col">
            <div className="h-[50px] flex items-center bg-[#28303E] p-4">
                <h1 className="text-xl font-bold text-white mb-2">Smart TaskHub</h1>
            </div>
            <div className="grow overflow-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="h-full flex items-start overflow-x-auto gap-4 p-4">
                        <SortableContext
                            items={columns.map(col => col.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {
                                columns.map(col => (
                                    <DroppableColumn 
                                        key={col.id}
                                        column={col}
                                        items={col.items}
                                        isAddingCard={activeInputColumnId === col.id}
                                        cardTitle={cardTitle}
                                        setCardTitle={setCardTitle}
                                        onStartAddingCard={handleStartAddingCard}
                                        onSubmitCard={handleSubmitCard}
                                        onCancelCard={handleCancelCard}
                                        onDeleteItem={deleteItem}
                                        onDeleteColumn={deleteColumn}
                                        onUpdateColumnTitle={handleUpdateColumnTitle}

                                    />
                                ))
                            }
                        </SortableContext>

                        <button
                            onClick={addColumn}
                            className="bg-[#ffffff3d] hover:bg-[#ffffff33] rounded-lg p-4 w-80 flex-shrink-0 transition-colors flex items-center justify-center gap-2 text-white"
                        >
                            <Plus size={20} />
                            Add another column
                        </button>
                    </div>
                    <DragOverlay>
                        {activeColumn ? (
                            <div className="bg-[rgba(0,0,0,0.7)] rounded-lg p-4 w-80 opacity-95 transform rotate-2 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <GripVertical size={16} className="text-gray-400" />
                                <h3 className="font-semibold text-white">{activeColumn.title}</h3>
                                <span className="bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {activeColumn.items.length}
                                </span>
                            </div>
                            </div>
                        ) : activeItem ? (
                            <div className="bg-[rgba(0,0,0,0.6)] p-3 rounded-lg shadow-2xl opacity-95 transform rotate-2">
                            <span className="text-sm text-white">{activeItem.content}</span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}

export default Board;
