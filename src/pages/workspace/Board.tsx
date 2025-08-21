import CreateBoard from "@/components/shared/CreateBoard";
import { getBoards, getWorkspaceById } from "@/services/workspaceService";
import type { Board } from "@/types/project";
import type { WorkSpace } from "@/types/workspace";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Boards = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [workspaceData, setWorkSpaceData] = useState<WorkSpace>();
    const [boards, setBoards] = useState<Board[]>([]);
    const backgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'

    const handleBoardNavigate = () => {
        navigate('/board')
    };

    const fetchWorkspaceDetail = async () => {
        if (!id) return;
        return await getWorkspaceById(Number.parseInt(id))
            .then(data => data?.data || null)
            .catch(err => navigate('/not-found'));
    };

    const fetchBoards = async () => {
        if (!id) return;
        return await getBoards(Number.parseInt(id))
            .then(data => data?.data || null)
            .catch(err => console.log(err))
    };

    const refetchBoards = async () => {
        const boards = await fetchBoards();
        boards && setBoards([...boards]);
    };

    useEffect(() => {

        const fetchData = async () => {
            const [workspace, boards] = await Promise.all([
                fetchWorkspaceDetail(),
                fetchBoards()
            ]);

            workspace && setWorkSpaceData({ ...workspace });
            boards && setBoards([...boards]);
        }
        fetchData()
    }, [id]);

    return (
        <>
            <div className="h-full bg-[#1E2125] text-white">
                {/* Header */}
                <div className="p-8">
                    <div className="flex items-center mb-8">
                        <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-black font-bold text-xl mr-4">
                            {workspaceData?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">{workspaceData?.name}</h1>
                            <span className="text-sm text-gray-400">🔒 Private</span>
                        </div>
                    </div>

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
                                    onClick={handleBoardNavigate}
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
                                onBoardCreated={refetchBoards}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Boards;