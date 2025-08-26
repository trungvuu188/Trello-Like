import BoardNavbar from '@/components/board/BoardNavbar';
import DroppableColumn from '@/components/board/DroppableColumn';
import TaskDetailModal from '@/components/board/TaskDetailModal';
import type { Column, Item } from '@/types';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    pointerWithin,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { GripVertical, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const WorkspaceBoard = () => {
    const [columns, setColumns] = useState<Column[]>([
        {
            id: 'col-1',
            title: 'Backlog',
            items: [
                { id: 'item-1', content: 'Design the new landing page' },
                { id: 'item-2', content: 'Set up database schema' },
                { id: 'item-3', content: 'Write API auth' },
            ],
        },
        {
            id: 'col-2',
            title: 'To do',
            items: [
                { id: 'item-4', content: 'Security config' },
                { id: 'item-5', content: 'Responsive for layout' },
            ],
        },
        {
            id: 'col-3',
            title: 'Process',
            items: [
                { id: 'item-6', content: 'Unit testing' },
                { id: 'item-7', content: 'CI/CD with Github Action' },
            ],
        },
    ]);

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [activeInputColumnId, setActiveInputColumnId] = useState<string | null>(null);
    const [cardTitle, setCardTitle] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // OPTIMIZATION: Track dragging state separately from active elements
    const [isDragging, setIsDragging] = useState(false);
    const [dragType, setDragType] = useState<'column' | 'item' | null>(null);

    // OPTIMIZATION: Debounce drag operations
    const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastDragOperationRef = useRef<string>('');

    // OPTIMIZATION: Store temporary drag state separately
    const dragStateRef = useRef<{
        originalColumns: Column[];
        currentColumns: Column[];
        hasChanged: boolean;
    }>({
        originalColumns: [],
        currentColumns: [],
        hasChanged: false,
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Memoize column IDs to prevent unnecessary SortableContext rerenders
    const columnIds = useMemo(() => columns.map(col => col.id), [columns]);

    // OPTIMIZATION: Memoize active elements only when activeId changes
    const activeElements = useMemo(() => {
        if (!activeId) return { activeColumn: null, activeItem: null };

        const activeColumn = columns.find(col => col.id === activeId);
        const activeItem = activeColumn
            ? null
            : columns
                .flatMap(col => col.items)
                .find(item => item.id === activeId);

        return { activeColumn, activeItem };
    }, [activeId, columns]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setActiveInputColumnId(null);
                setCardTitle('');
            }
        };

        if (activeInputColumnId) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeInputColumnId]);

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            setActiveId(event.active.id);
            setIsDragging(true);

            // Determine drag type
            const type = event.active.data.current?.type as 'column' | 'item';
            setDragType(type);

            // Store initial state
            dragStateRef.current = {
                originalColumns: columns,
                currentColumns: columns,
                hasChanged: false,
            };

            // Close any active input when starting drag
            setActiveInputColumnId(null);
            setCardTitle('');
        },
        [columns]
    );

    // OPTIMIZATION: Heavily optimized drag over with batching and debouncing
    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
            const { active, over } = event;

            if (!over || !isDragging) return;

            const activeId = active.id;
            const overId = over.id;

            if (activeId === overId) return;

            // OPTIMIZATION: Create operation signature to prevent duplicate operations
            const operationSignature = `${activeId}-${overId}`;
            if (lastDragOperationRef.current === operationSignature) {
                return;
            }
            lastDragOperationRef.current = operationSignature;

            // OPTIMIZATION: Clear previous timeout and batch operations
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
            }

            // OPTIMIZATION 10: Batch drag operations with timeout
            dragTimeoutRef.current = setTimeout(() => {
                const isActiveAnItem = active.data.current?.type === 'item';
                const isOverAnItem = over.data.current?.type === 'item';
                const isOverAColumn = over.data.current?.type === 'column';

                if (!isActiveAnItem) return;

                // Work with current drag state instead of component state
                const newColumns = [...dragStateRef.current.currentColumns];
                let hasChanged = false;

                // Item over item (different column)
                if (isActiveAnItem && isOverAnItem) {
                    const activeColumnIndex = newColumns.findIndex(col =>
                        col.items.find(item => item.id === activeId)
                    );
                    const overColumnIndex = newColumns.findIndex(col =>
                        col.items.find(item => item.id === overId)
                    );

                    if (
                        activeColumnIndex !== -1 &&
                        overColumnIndex !== -1 &&
                        activeColumnIndex !== overColumnIndex
                    ) {
                        const activeColumn = {
                            ...newColumns[activeColumnIndex],
                        };
                        const overColumn = { ...newColumns[overColumnIndex] };

                        const activeItemIndex = activeColumn.items.findIndex(
                            item => item.id === activeId
                        );
                        const overItemIndex = overColumn.items.findIndex(
                            item => item.id === overId
                        );

                        if (activeItemIndex !== -1 && overItemIndex !== -1) {
                            activeColumn.items = [...activeColumn.items];
                            overColumn.items = [...overColumn.items];

                            const [activeItem] = activeColumn.items.splice(
                                activeItemIndex,
                                1
                            );
                            overColumn.items.splice(
                                overItemIndex,
                                0,
                                activeItem
                            );

                            newColumns[activeColumnIndex] = activeColumn;
                            newColumns[overColumnIndex] = overColumn;
                            hasChanged = true;
                        }
                    }
                }

                // Item over column
                if (isActiveAnItem && isOverAColumn) {
                    const activeColumnIndex = newColumns.findIndex(col =>
                        col.items.find(item => item.id === activeId)
                    );
                    const overColumnIndex = newColumns.findIndex(
                        col => col.id === overId
                    );

                    if (
                        activeColumnIndex !== -1 &&
                        overColumnIndex !== -1 &&
                        activeColumnIndex !== overColumnIndex
                    ) {
                        const activeColumn = {
                            ...newColumns[activeColumnIndex],
                        };
                        const overColumn = { ...newColumns[overColumnIndex] };

                        const activeItemIndex = activeColumn.items.findIndex(
                            item => item.id === activeId
                        );

                        if (activeItemIndex !== -1) {
                            activeColumn.items = [...activeColumn.items];
                            overColumn.items = [...overColumn.items];

                            const [activeItem] = activeColumn.items.splice(
                                activeItemIndex,
                                1
                            );
                            overColumn.items.push(activeItem);

                            newColumns[activeColumnIndex] = activeColumn;
                            newColumns[overColumnIndex] = overColumn;
                            hasChanged = true;
                        }
                    }
                }

                // OPTIMIZATION: Only update state if something actually changed
                if (hasChanged) {
                    dragStateRef.current.currentColumns = newColumns;
                    dragStateRef.current.hasChanged = true;

                    // Update component state less frequently
                    setColumns(newColumns);
                }
            }, 16); // OPTIMIZATION: 16ms delay = ~60fps batching
        },
        [isDragging]
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        // OPTIMIZATION: Clear timeout and reset refs
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
            dragTimeoutRef.current = null;
        }

        setActiveId(null);
        setIsDragging(false);
        setDragType(null);
        lastDragOperationRef.current = '';

        if (!over) {
            // Restore original state if cancelled
            setColumns(dragStateRef.current.originalColumns);
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        const isActiveAColumn = active.data.current?.type === 'column';
        const isOverAColumn = over.data.current?.type === 'column';
        const isActiveAnItem = active.data.current?.type === 'item';
        const isOverAnItem = over.data.current?.type === 'item';

        // Handle column reordering
        if (isActiveAColumn && isOverAColumn) {
            setColumns(columns => {
                const activeColumnIndex = columns.findIndex(
                    col => col.id === activeId
                );
                const overColumnIndex = columns.findIndex(
                    col => col.id === overId
                );

                if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
                    return arrayMove(
                        columns,
                        activeColumnIndex,
                        overColumnIndex
                    );
                }

                return columns;
            });
        }

        // Handle item reordering within same column
        if (isActiveAnItem && isOverAnItem) {
            setColumns(prevColumns => {
                const activeColumnIndex = prevColumns.findIndex(col =>
                    col.items.find(item => item.id === activeId)
                );
                const overColumnIndex = prevColumns.findIndex(col =>
                    col.items.find(item => item.id === overId)
                );

                if (
                    activeColumnIndex === overColumnIndex &&
                    activeColumnIndex !== -1
                ) {
                    const newColumns = [...prevColumns];
                    const column = { ...newColumns[activeColumnIndex] };

                    const activeItemIndex = column.items.findIndex(
                        item => item.id === activeId
                    );
                    const overItemIndex = column.items.findIndex(
                        item => item.id === overId
                    );

                    if (activeItemIndex !== -1 && overItemIndex !== -1) {
                        column.items = arrayMove(
                            column.items,
                            activeItemIndex,
                            overItemIndex
                        );
                        newColumns[activeColumnIndex] = column;
                        return newColumns;
                    }
                }

                return prevColumns;
            });
        }
    }, []);

    const addColumn = useCallback(() => {
        const newColumn: Column = {
            id: `col-${Date.now()}`,
            title: `New Column`,
            items: [],
        };
        setColumns(pre => [...pre, newColumn]);
    }, []);

    const handleUpdateColumnTitle = useCallback(
        (columnId: string, newTitle: string) => {
            setColumns(columns =>
                columns.map(column =>
                    column.id === columnId
                        ? { ...column, title: newTitle }
                        : column
                )
            );
        },
        []
    );

    const deleteColumn = useCallback(
        (columnId: string) => {
            setColumns(columns =>
                columns.filter(column => column.id !== columnId)
            );
            if (activeInputColumnId === columnId) {
                setActiveInputColumnId(null);
                setCardTitle('');
            }
        },
        [activeInputColumnId]
    );

    const handleStartAddingCard = useCallback((columnId: string) => {
        setActiveInputColumnId(columnId);
        setCardTitle('');
    }, []);

    const handleSubmitCard = useCallback(
        async (columnId: string) => {
            setActiveInputColumnId(null);
            setCardTitle('');
            if (cardTitle.trim()) {
                const newItem: Item = {
                    id: `item-${Date.now()}`,
                    content: cardTitle.trim(),
                };

                setColumns(columns =>
                    columns.map(column =>
                        column.id === columnId
                            ? { ...column, items: [...column.items, newItem] }
                            : column
                    )
                );
            }
        },
        [cardTitle]
    );

    const handleCancelCard = useCallback(() => {
        setActiveInputColumnId(null);
        setCardTitle('');
    }, []);

    const deleteItem = useCallback((itemId: string) => {
        setColumns(columns =>
            columns.map(column => ({
                ...column,
                items: column.items.filter(item => item.id !== itemId),
            }))
        );
    }, []);

    const handleHideDetailModal = useCallback(() => {
        setShowDetailModal(false);
    }, []);

    const handleShowDetailModal = useCallback(() => {
        setShowDetailModal(true);
    }, []);

    // OPTIMIZATION: Memoize column props to prevent unnecessary rerenders
    const columnProps = useMemo(
        () =>
            columns.map(col => ({
                key: col.id,
                column: col,
                items: col.items,
                isAddingCard: activeInputColumnId === col.id,
                isDragging: isDragging && dragType === 'item',
            })),
        [columns, activeInputColumnId, isDragging, dragType]
    );

    return (
        <div className='bg-[#283449] w-full h-full flex flex-col'>
            <BoardNavbar />
            <div className='grow overflow-hidden'>
                <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className='h-full flex items-start overflow-x-auto gap-4 p-4'>
                        <SortableContext
                            items={columnIds}
                            strategy={horizontalListSortingStrategy}
                        >
                            {columnProps.map(col => (
                                <DroppableColumn
                                    key={col.key}
                                    column={col.column}
                                    items={col.items}
                                    isAddingCard={col.isAddingCard}
                                    cardTitle={cardTitle}
                                    setCardTitle={setCardTitle}
                                    onStartAddingCard={handleStartAddingCard}
                                    onSubmitCard={handleSubmitCard}
                                    onCancelCard={handleCancelCard}
                                    onDeleteItem={deleteItem}
                                    onDeleteColumn={deleteColumn}
                                    onUpdateColumnTitle={handleUpdateColumnTitle}
                                    handleShowDetailTask={handleShowDetailModal}
                                />
                            ))}
                        </SortableContext>

                        <button
                            onClick={addColumn}
                            className='bg-[#ffffff3d] hover:bg-[#ffffff33] rounded-lg p-4 w-80 flex-shrink-0 transition-colors flex items-center justify-center gap-2 text-white'
                        >
                            <Plus size={20} />
                            Add another column
                        </button>
                    </div>
                    <DragOverlay>
                        {activeElements.activeColumn ? (
                            <div className='bg-[rgba(0,0,0,0.7)] rounded-lg p-4 w-80 opacity-95 transform rotate-2 shadow-2xl'>
                                <div className='flex items-center gap-2 mb-4'>
                                    <GripVertical
                                        size={16}
                                        className='text-gray-400'
                                    />
                                    <h3 className='font-semibold text-white'>
                                        {activeElements.activeColumn.title}
                                    </h3>
                                    <span className='bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full'>
                                        {
                                            activeElements.activeColumn.items
                                                .length
                                        }
                                    </span>
                                </div>
                            </div>
                        ) : activeElements.activeItem ? (
                            <div className='bg-[rgba(0,0,0,0.6)] p-3 rounded-lg shadow-2xl opacity-95 transform rotate-2'>
                                <span className='text-sm text-white whitespace-pre-wrap break-words'>
                                    {activeElements.activeItem.content}
                                </span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
            <TaskDetailModal
                isOpen={showDetailModal}
                onClose={handleHideDetailModal}
                item={{ id: '1', content: 'Hello' }}
            />
        </div>
    );
};

export default WorkspaceBoard;
