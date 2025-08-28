import React, { useState, useRef } from 'react';
import { ArrowLeft, Search, RotateCcw, Trash2, X } from 'lucide-react';

interface ArchivedItem {
    id: string;
    title: string;
    type: 'card' | 'list';
    archivedAt: Date;
    columnId?: string; // For cards, which column they came from
}

interface ArchivedItemsModalProps {
    onClose: () => void;
    onBack: () => void;
    archivedCards: ArchivedItem[];
    archivedLists: ArchivedItem[];
    onRestoreCard: (cardId: string) => void;
    onRestoreList: (listId: string) => void;
    onDeleteCard: (cardId: string) => void;
    onDeleteList: (listId: string) => void;
}

const ArchivedItemsModal: React.FC<ArchivedItemsModalProps> = ({
    onClose,
    onBack,
    archivedCards,
    archivedLists,
    onRestoreCard,
    onRestoreList,
    onDeleteCard,
    onDeleteList,
}) => {
    const [currentView, setCurrentView] = useState<'cards' | 'lists'>('cards');
    const [searchTerm, setSearchTerm] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    const currentItems = currentView === 'cards' ? archivedCards : archivedLists;
    const filteredItems = currentItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRestore = (itemId: string, itemType: 'card' | 'list') => {
        if (itemType === 'card') {
            onRestoreCard(itemId);
        } else {
            onRestoreList(itemId);
        }
    };

    const handleDelete = (itemId: string, itemType: 'card' | 'list') => {
        if (itemType === 'card') {
            onDeleteCard(itemId);
        } else {
            onDeleteList(itemId);
        }
    };

    return (
        <div
            ref={modalRef}
            className="absolute right-0 top-10 z-50 bg-[#282E33] rounded-lg w-[500px] max-h-[600px] flex flex-col border border-[#394B59]"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#394B59]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="text-[#B6C2CF] hover:text-white hover:bg-[#394B59] rounded p-1 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-[#B6C2CF] font-medium text-lg">
                        Archived items
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-[#9FADBC] hover:text-white hover:bg-[#394B59] rounded p-1 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Search and Switch */}
            <div className="p-4 border-b border-[#394B59]">
                <div className="flex gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9FADBC]" size={16} />
                        <input
                            type="text"
                            placeholder="Search archive..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-[#22272B] border border-[#394B59] rounded text-[#B6C2CF] placeholder-[#9FADBC] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setCurrentView(currentView === 'cards' ? 'lists' : 'cards')}
                        className="px-4 py-2 bg-[#394B59] hover:bg-[#4A5760] text-[#B6C2CF] rounded transition-colors whitespace-nowrap"
                    >
                        Switch to {currentView === 'cards' ? 'lists' : 'cards'}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-[#9FADBC] text-lg mb-2">
                            No archived {currentView}
                        </div>
                        <div className="text-[#6B7784] text-sm">
                            {searchTerm ? 'No items match your search.' : `No ${currentView} have been archived yet.`}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#22272B] border border-[#394B59] rounded-lg p-3 hover:border-[#4A5760] transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[#B6C2CF] font-medium mb-1 break-words">
                                            {item.title}
                                        </div>
                                        <div className="text-[#9FADBC] text-xs">
                                            Archived {item.archivedAt.toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleRestore(item.id, item.type)}
                                            className="p-1.5 text-[#9FADBC] hover:text-[#B6C2CF] hover:bg-[#394B59] rounded transition-colors"
                                            title="Restore"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id, item.type)}
                                            className="p-1.5 text-[#9FADBC] hover:text-red-400 hover:bg-[#394B59] rounded transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchivedItemsModal;