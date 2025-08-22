import CreateBoard from "@/components/shared/CreateBoard";
import LoadingContent from "@/components/ui/LoadingContent";
import { deleteBoard, getBoards, getClosedBoards, getWorkspaceById, reopenBoard, updateWorkspace } from "@/services/workspaceService";
import type { Board } from "@/types/project";
import type { WorkSpace } from "@/types/workspace";
import { Folder, Pencil, RotateCcw, Trash2, X } from "lucide-react";
import { useEffect, useState, type SetStateAction } from "react";
import { useNavigate, useParams } from "react-router-dom";

const backgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'

const Boards = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [workspaceData, setWorkSpaceData] = useState<WorkSpace>({
        id: id ? Number.parseInt(id) : undefined,
        name: '',
        desc: '',
    });
    const [workspaceEditData, setWorkspaceEditData] = useState<WorkSpace>(workspaceData);
    const [boards, setBoards] = useState<Board[]>([]);
    const [closedBoards, setClosedBoards] = useState<WorkSpace[]>([]);
    const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
    const [workspaceNameError, setWorkspaceNameError] = useState('');
    const [workspaceDescriptionError, setWorkspaceDescriptionError] = useState('');
    const [showClosedBoards, setShowClosedBoards] = useState(false);
    const [loadingClosedModal, setLoadingClosedModal] = useState(false);
    const [loadingDeleteConfirmModal, setLoadingDeleteConfirmModal] = useState(false);
    const [loadingReopenConfirmModal, setLoadingReopenConfirmModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showReopenConfirm, setShowReopenConfirm] = useState(false);

    const isWorkspaceChanged = (
        original: WorkSpace,
        edited: WorkSpace
    ): boolean => {
        return (
            original.name !== edited.name ||
            original.desc !== edited.desc
        );
    };

    const handleBoardNavigate = (id: number) => {
        navigate(`/board/${id}`)
    };

    const onEditingButtonClick = () => {
        setIsEditingWorkspace(!isEditingWorkspace);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        if (!isWorkspaceChanged(workspaceData, workspaceEditData)) {
            setIsEditingWorkspace(false);
            return;
        };
        await updateWorkspace(
            Number.parseInt(id),
            workspaceEditData?.name,
            workspaceEditData?.desc || null
        ).then(_ => {
            setIsEditingWorkspace(false);
            fetchWorkspaceDetail();
        })
            .catch(error => {
                const errorFields = error?.response?.data?.errors || [];
                // Set error messages based on the response
                errorFields.forEach((element: { field: string; message: SetStateAction<string>; }) => {
                    switch (element.field) {
                        case 'name':
                            setWorkspaceNameError(element.message);
                            break;
                        case 'description':
                            setWorkspaceDescriptionError(element.message);
                            break;
                    }
                });
            })
    }

    const fetchWorkspaceDetail = async () => {
        if (!id) return;
        await getWorkspaceById(Number(id))
            .then(data => {
                if (!data?.data) throw new Error("Workspace not found");
                setWorkSpaceData(data.data);
                setWorkspaceEditData(data.data);
            })
            .catch(_ => navigate('/not-found'));
    };

    const fetchBoards = async () => {
        if (!id) return;
        return await getBoards(Number(id))
            .then(data => {
                data?.data && setBoards(data.data);
            })
            .catch(err => console.log(err))
    };

    const fetchClosedBoards = async () => {
        setShowClosedBoards(true);
        setLoadingClosedModal(true);
        setTimeout( async () => {
            await getClosedBoards()
            .then(data => {
                    data?.data && setClosedBoards(data.data)
                    setLoadingClosedModal(false);
                })
                .catch(err => console.log(err))
        }, 2000)
    };

    const handleReopenBoard = async (boardId: number | undefined) => {
        if(!boardId) return;
        setLoadingReopenConfirmModal(true);
        await reopenBoard(boardId);
        setLoadingReopenConfirmModal(false);
        cancelAction();
    };

    const handleDeleteBoard = async (boardId: number | undefined) => {
        if(!boardId) return;
        setLoadingDeleteConfirmModal(true);
        await deleteBoard(boardId);
        setLoadingDeleteConfirmModal(false);
        cancelAction();
    };

    const cancelAction = () => {
        setShowClosedBoards(false);
        setShowDeleteConfirm(false);
        setShowReopenConfirm(false);
    };

    const preventPropagation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (!id) return;
        Promise.all([
            fetchWorkspaceDetail(),
            fetchBoards()
        ]);
    }, [id]);

    return (
        <div className="h-full bg-[#1E2125] text-white">
            {/* Header */}
            <div className="p-8">
                {isEditingWorkspace ? (
                    <form className="pb-8 mb-8 border-b" onSubmit={handleSubmit}>
                        <div className='mb-2'>
                            <label className='block text-sm text-gray-400 mb-1 font-bold' htmlFor='workspaceName'>Name <span className='text-red-500'>*</span></label>
                            <div className='text-red-500 text-sm mb-1'>
                                {workspaceNameError}
                            </div>
                            <input
                                type='text'
                                defaultValue={workspaceData?.name}
                                id='workspaceName'
                                name='name'
                                onChange={(e) => setWorkspaceEditData({ ...workspaceEditData, name: e.target.value })}
                                placeholder='Update workspace name...'
                                className='min-w-1/2 p-2 rounded border-1 border-neutral-500 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <div className='mb-2'>
                            <label className='block text-sm text-gray-400 mb-1 font-bold' htmlFor='workspaceDescription'>Description</label>
                            <div className='text-red-500 text-sm mb-1'>
                                {workspaceDescriptionError}
                            </div>
                            <textarea
                                rows={3}
                                defaultValue={workspaceData?.desc}
                                id='workspaceDescription'
                                name='description'
                                onChange={(e) => setWorkspaceEditData({ ...workspaceEditData, desc: e.target.value })}
                                placeholder='Update workspace name...'
                                className='min-w-1/2 p-2 rounded border-1 border-neutral-500 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className='px-4 py-2 bg-blue-500 text-gray-800 font-semibold rounded hover:bg-blue-500 transition-colors'
                        >
                            Save
                        </button>
                        <button
                            type='button'
                            className='ml-2 px-4 py-2 bg-gray-700 font-semibold text-gray-400 rounded hover:bg-gray-600 transition-colors'
                            onClick={() => onEditingButtonClick()}
                        >
                            Cancel
                        </button>
                    </form>
                ) :
                    <div className="flex items-center mb-8 pb-8 border-b">
                        <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-black font-bold text-xl mr-4">
                            {workspaceData?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">
                                {workspaceData?.name}
                                <button className='ml-3 p-2 rounded hover:bg-gray-600 transition-colors' onClick={() => setIsEditingWorkspace(true)}>
                                    <Pencil className='w-4 h-4 text-gray-400' />
                                </button>
                            </h1>
                            <span className="text-sm text-gray-400">{workspaceData?.desc}</span>
                        </div>
                    </div>
                }

                {/* Your boards section */}
                <div>
                    <div className="flex items-center mb-6">
                        <span className="mr-2">👤</span>
                        <h2 className="text-lg font-medium">Your boards</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {/* Existing boards */}
                        {boards?.map(board => (
                            <div
                                key={board.id}
                                onClick={() => handleBoardNavigate(board.id)}
                                className={`
                                        flex items-end
                                        h-24 rounded-lg cursor-pointer overflow-hidden
                                        hover:opacity-90 transition-opacity `}
                                style={{
                                    backgroundImage: `url(${backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="grow p-2 bg-black/50 flex items-end justify-between">
                                    <h3 className="text-white font-medium text-sm">{board.name}</h3>
                                </div>
                            </div>
                        ))}

                        {/* Create new board button */}
                        <CreateBoard
                            id={id ? Number.parseInt(id) : null}
                            onBoardCreated={fetchBoards}
                        />
                    </div>

                    {/* View closed boards button */}
                    <button
                        onClick={fetchClosedBoards}
                        className="mt-6 p-2 rounded bg-[#A1BDD914] hover:bg-[#BFDBF847] text-gray-300 cursor-pointer font-bold text-sm transition-colors"
                    >
                        View closed boards
                    </button>

                    {/* Closed Boards Modal */}
                    {showClosedBoards && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/50 z-50"
                                onClick={cancelAction}
                            />

                            {/* Modal */}
                            <div className="fixed top-0 left-[50%] -translate-x-[50%] w-[768px] flex items-center justify-center z-50 p-4">
                                <div className="bg-[#2c3440] rounded-lg shadow-xl w-full max-w-2xl border border-gray-600">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <Folder className="w-5 h-5 text-gray-300" />
                                            <h2 className="text-white font-medium text-lg">Closed boards</h2>
                                        </div>
                                        <button
                                            onClick={() => setShowClosedBoards(false)}
                                            className="text-gray-400 hover:text-white cursor-pointer transition-colors p-1 rounded"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-4 max-h-96">
                                        {
                                        loadingClosedModal ? 
                                        <LoadingContent /> : 
                                        closedBoards.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400">No closed boards found</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {closedBoards.map((board) => (
                                                    <div
                                                        key={board.id}
                                                        className="flex items-center justify-between p-3 bg-[#1e2328] rounded-lg hover:bg-[#252a30] transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            {/* Board Thumbnail */}
                                                            <div className="w-12 h-8 rounded bg-gray-600 overflow-hidden flex-shrink-0">
                                                                <img
                                                                    src={backgroundImage}
                                                                    alt={board.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            {/* Board Info */}
                                                            <div>
                                                                <h3 className="text-blue-400 font-medium text-sm hover:underline cursor-pointer">
                                                                    {board.name}
                                                                </h3>
                                                                <p className="text-gray-400 text-xs">
                                                                    {board.desc}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex items-center space-x-2">
                                                            <div
                                                                onClick={() => {
                                                                    setShowDeleteConfirm(false);
                                                                    setShowReopenConfirm(true);
                                                                }}
                                                                className="relative flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                                                            >
                                                                <RotateCcw className="w-3 h-3" />
                                                                <span>Reopen</span>
                                                                {/* Reopen Confirmation Modal */}
                                                                {showReopenConfirm && (
                                                                    <>
                                                                        {/* Reopen Confirmation Modal */}
                                                                        <div className="absolute top-full left-[50%] -translate-x-[50%] flex items-center justify-center z-60 p-4">
                                                                            <div className="bg-[#2c3440] rounded-lg shadow-xl w-full max-w-sm border border-gray-600">
                                                                                {/* Modal Header */}
                                                                                <div className="flex items-center w-[300px] justify-between p-4 border-b border-gray-600">
                                                                                    <h2 className="text-white font-medium">Reopen board?</h2>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            preventPropagation(e);
                                                                                            setShowReopenConfirm(false);
                                                                                        }}
                                                                                        className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                                                                                    >
                                                                                        <X className="w-4 h-4" />
                                                                                    </button>
                                                                                </div>

                                                                                {/* Modal Body */}
                                                                                <div className="p-4">
                                                                                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                                                                        This board will be reopened and moved back to your active boards. You can close it again at any time.
                                                                                    </p>
                                                                                    
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            preventPropagation(e);
                                                                                            handleReopenBoard(board.id);
                                                                                        }}
                                                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium transition-colors"
                                                                                    >
                                                                                        { loadingReopenConfirmModal ? <LoadingContent /> : 'Reopen'}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div
                                                                onClick={() => {
                                                                    setShowReopenConfirm(false);
                                                                    setShowDeleteConfirm(true);
                                                                }}
                                                                className="relative flex items-center gap-2 cursor-pointer px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3 shrink-0" />
                                                                <span>Delete</span>
                                                                {/* Delete Confirmation Modal */}
                                                                {showDeleteConfirm && (
                                                                    <>
                                                                        {/* Delete Confirmation Modal */}
                                                                        <div className="absolute top-full left-[50%] -translate-x-[50%] flex items-center justify-center z-60 p-4">
                                                                            <div className="bg-[#2c3440] rounded-lg shadow-xl w-[300px] border border-gray-600">
                                                                                {/* Modal Header */}
                                                                                <div className="flex items-center justify-between p-4 border-b border-gray-600">
                                                                                    <h2 className="text-white font-medium">Delete board?</h2>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            preventPropagation(e);
                                                                                            setShowDeleteConfirm(false)
                                                                                        }}
                                                                                        className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                                                                                    >
                                                                                        <X className="w-4 h-4" />
                                                                                    </button>
                                                                                </div>

                                                                                {/* Modal Body */}
                                                                                <div className="p-4">
                                                                                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                                                                        All lists, cards and actions will be deleted, and you won't be able to re-open the board. There is no undo.
                                                                                    </p>
                                                                                    
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            preventPropagation(e);
                                                                                            handleDeleteBoard(board.id);
                                                                                        }}
                                                                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded font-medium transition-colors"
                                                                                    >
                                                                                        {loadingDeleteConfirmModal ? <LoadingContent /> : 'Delete'}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Boards;