import ClosedBoards from "@/components/board/ClosedBoards";
import CreateBoard from "@/components/shared/CreateBoard";
import { notify } from "@/services/toastService";
import { getBoards, getWorkspaceById, updateWorkspace } from "@/services/workspaceService";
import type { Board } from "@/types/project";
import type { WorkSpace } from "@/types/workspace";
import { Pencil, Users } from "lucide-react";
import { useEffect, useState, type SetStateAction } from "react";
import { useNavigate, useParams } from "react-router-dom";

const backgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'

const Boards = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [workspaceData, setWorkSpaceData] = useState<WorkSpace>({
        id: Number(id),
        name: '',
        desc: '',
    });
    const [workspaceEditData, setWorkspaceEditData] = useState<WorkSpace>(workspaceData);
    const [boards, setBoards] = useState<Board[]>([]);
    const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
    const [workspaceNameError, setWorkspaceNameError] = useState('');
    const [workspaceDescriptionError, setWorkspaceDescriptionError] = useState('');
    const [showClosedBoards, setShowClosedBoards] = useState(false);

    const isWorkspaceChanged = (
        original: WorkSpace,
        edited: WorkSpace
    ): boolean => {
        return (
            original.name !== edited.name ||
            original.desc !== edited.desc
        );
    };

    const handleBoardNavigate = (boardId: number) => {
        navigate(`/workspace/${id}/board/${boardId}`, { replace: true });
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
        ).then(data => {
            notify.success(data.message);
            setIsEditingWorkspace(false);
            fetchWorkspaceDetail();
        })
            .catch(error => {
                const errorFields = error?.response?.data?.errors || [];
                notify.success(errorFields);
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
                        <Users className="mr-2" />
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
                            id={id ? Number(id) : null}
                            workspaceName={workspaceData.name}
                            onBoardCreated={fetchBoards}
                        />
                    </div>

                    {/* View closed boards button */}
                    <button
                        onClick={() => setShowClosedBoards(true)}
                        className="mt-6 p-2 rounded bg-[#A1BDD914] hover:bg-[#BFDBF847] text-gray-300 cursor-pointer font-bold text-sm transition-colors"
                    >
                        View closed boards
                    </button>

                    {/* Closed Boards Modal */}
                    {showClosedBoards && 
                        <ClosedBoards 
                            hideClosedBoards={() => setShowClosedBoards(false)} 
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default Boards;

