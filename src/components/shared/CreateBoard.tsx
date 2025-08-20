import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';

const backgroundOptions = [
    { type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1464822759844-d150baec93c5?w=300&h=200&fit=crop' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=200&fit=crop' },
    { type: 'color', color: 'bg-gray-200' },
    { type: 'color', color: 'bg-blue-400' },
    { type: 'color', color: 'bg-blue-600' },
    { type: 'color', color: 'bg-purple-400' },
    { type: 'color', color: 'bg-pink-400' }
];

const CreateBoard = () => {

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [boardTitle, setBoardTitle] = useState('');
    const [selectedBackground, setSelectedBackground] = useState(0);

    const handleCreateBoard = () => {
        if (boardTitle.trim()) {
            setShowCreateModal(false);
            setBoardTitle('');
            setSelectedBackground(0);
        }
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setBoardTitle('');
        setSelectedBackground(0);
    };

    return (
        <>
            <div
                onClick={() => setShowCreateModal(true)}
                className="
                    h-24 bg-[#2A2D31] hover:bg-[#3A3D41] rounded-lg cursor-pointer transition-colors 
                    flex items-center justify-center border-2 border-dashed border-gray-600"
                >
                <span className="text-gray-400 font-medium">Create new board</span>
            </div>
            {/* Create Board Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-[#2A2D31] rounded-lg p-0 w-[300px] max-w-md mx-4 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-600">
                            <h3 className="text-lg font-medium text-white">Create board</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-white text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Background Preview */}
                            <div className="mb-4">
                                <div
                                    className={`w-full h-20 rounded-lg mb-3 ${backgroundOptions[selectedBackground]?.type === 'image' ? 'bg-cover bg-center' : backgroundOptions[selectedBackground]?.color || 'bg-gray-600'
                                        }`}
                                    style={backgroundOptions[selectedBackground]?.type === 'image' ? {
                                        backgroundImage: `url(${backgroundOptions[selectedBackground]?.url})`
                                    } : {}}
                                >
                                    <div className="w-full h-full bg-opacity-20 rounded-lg flex items-center justify-center"></div>
                                </div>

                                <label className="block text-sm text-gray-300 mb-2">Background</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {backgroundOptions.map((option, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedBackground(index)}
                                            className={`w-12 h-8 rounded cursor-pointer border-2 ${selectedBackground === index ? 'border-blue-400' : 'border-transparent'
                                                } ${option.type === 'image' ? 'bg-cover bg-center' : option.color}`}
                                            style={option.type === 'image' ? {
                                                backgroundImage: `url(${option.url})`
                                            } : {}}
                                        />
                                    ))}
                                    <div className="w-12 h-8 rounded cursor-pointer border-2 border-transparent bg-gray-600 flex items-center justify-center text-gray-400 text-xs">
                                        ⋯
                                    </div>
                                </div>
                            </div>

                            {/* Board Title Input */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-300 mb-2">
                                    Board title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={boardTitle}
                                    onChange={(e) => setBoardTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#1E2125] border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                                    placeholder=""
                                />
                                {!boardTitle && (
                                    <div className="flex items-center gap-2 mt-2 text-orange-400">
                                        <TriangleAlert />
                                        <span className="text-sm">Board title is required</span>
                                    </div>
                                )}
                            </div>

                            {/* Workspace Dropdown */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-300 mb-2">Workspace</label>
                                <select className="w-full px-3 py-2 bg-[#1E2125] border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400">
                                    <option>Nashtech</option>
                                </select>
                            </div>

                            {/* Visibility Dropdown */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-300 mb-2">Visibility</label>
                                <select className="w-full px-3 py-2 bg-[#1E2125] border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400">
                                    <option>Workspace</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-3">
                                <button
                                    onClick={handleCreateBoard}
                                    disabled={!boardTitle.trim()}
                                    className={`w-full py-2 text-sm rounded font-medium ${boardTitle.trim()
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateBoard;
