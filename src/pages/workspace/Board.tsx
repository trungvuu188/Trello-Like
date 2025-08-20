import CreateBoard from "@/components/shared/CreateBoard";
import { useNavigate } from "react-router-dom";

const Boards = () => {

    const navigate = useNavigate();

    // Sample board data
    const boards = [
        {
            id: 1,
            title: 'Smart TaskHub',
            background: 'bg-blue-600',
            isStarred: true
        },
        {
            id: 2,
            title: 'Test',
            background: 'bg-cover bg-center',
            backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
        }
    ];

    const handleBoardNavigate = () => {
        navigate('/board')
    }

    return (
        <>
            <div className="h-full bg-[#1E2125] text-white">
                {/* Header */}
                <div className="p-8">
                    <div className="flex items-center mb-8">
                        <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-black font-bold text-xl mr-4">
                            N
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">Nashtech</h1>
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
                            {boards.map(board => (
                                <div
                                    key={board.id}
                                    onClick={handleBoardNavigate}
                                    className={`
                                            flex items-end
                                            h-24 rounded-lg cursor-pointer overflow-hidden
                                            hover:opacity-90 transition-opacity ${board.backgroundImage ? '' : board.background
                                        }`}
                                    style={board.backgroundImage ? {
                                        backgroundImage: `url(${board.backgroundImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    } : {}}
                                >
                                    <div className="grow p-2 bg-black/50 flex items-end justify-between">
                                        <h3 className="text-white font-medium text-sm">{board.title}</h3>
                                        {board.isStarred && (
                                            <div className="flex justify-end">
                                                <span className="text-yellow-400">⭐</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Create new board button */}
                            <CreateBoard />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Boards;