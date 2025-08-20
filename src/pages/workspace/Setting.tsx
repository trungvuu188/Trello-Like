import { deleteWorkspace } from "@/services/workspaceService";
import { useState } from "react";

const Setting = () => {


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInputValue, setDeleteInputValue] = useState('');

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteInputValue.toLowerCase() === 'nashtech') {
            setShowDeleteModal(false);
            setDeleteInputValue('');
            await deleteWorkspace(1);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setDeleteInputValue('');
    };

    return (
        <div className="
            h-full flex flex-col justify-items-start
            bg-[#1E2125] text-white p-8"
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-6">Workspace settings</h1>
                
                {/* Workspace Info */}
                <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-black font-bold text-xl mr-4">
                        N
                    </div>
                    <div>
                        <h2 className="text-lg font-medium">Nashtech</h2>
                        <span className="text-sm text-gray-400">🔒 Private</span>
                    </div>
                </div>
            </div>

            {/* Workspace visibility */}
            <div className="mb-8 pb-6 border-b border-gray-700">
                <h3 className="text-lg font-medium mb-4">Workspace visibility</h3>
                <div className="flex items-center justify-between bg-[#2A2D31] p-4 rounded-lg">
                    <div className="flex items-center">
                        <span className="text-red-400 mr-2">🔒</span>
                        <span className="text-sm">Private – This Workspace is private. It's not indexed or visible to those outside the Workspace.</span>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        Change
                    </button>
                </div>
            </div>

            {/* Delete workspace */}
                <div className="relative pt-6 mt-auto">
                    <button 
                        onClick={handleDeleteClick}
                        className="text-red-400 hover:text-red-300 text-sm font-medium underline">
                        Delete this Workspace?
                    </button>
                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && (
                        <div className="absolute bottom-full left-0 flex items-center justify-center z-50">
                            <div className="bg-[#2A2D31] rounded-lg p-6 w-[480px] max-w-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-white">Delete Workspace?</h3>
                                    <button 
                                        onClick={handleDeleteCancel}
                                        className="text-gray-400 hover:text-white text-2xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-300 mb-4">
                                        Enter the Workspace name <strong>"Nashtech"</strong> to delete:
                                    </p>
                                    
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400 mb-3">Things to know:</p>
                                        <ul className="text-sm text-gray-400 space-y-2">
                                            <li>• This is permanent and can't be undone.</li>
                                            <li>• <span className="underline">All boards in this Workspace will be closed</span>.</li>
                                            <li>• Board admins can reopen boards.</li>
                                            <li>• Board members will not be able to interact with closed boards.</li>
                                        </ul>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-2">
                                        Enter the Workspace name to delete:
                                    </p>
                                    <input
                                        type="text"
                                        value={deleteInputValue}
                                        onChange={(e) => setDeleteInputValue(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#1E2125] border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                                        placeholder=""
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={handleDeleteConfirm}
                                        disabled={deleteInputValue.toLowerCase() !== 'nashtech'}
                                        className={`px-4 py-2 text-sm rounded font-medium ${
                                            deleteInputValue.toLowerCase() === 'nashtech'
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Delete Workspace
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default Setting;