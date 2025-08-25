import clsx from 'clsx';
import { Folders, House, LayoutTemplate, ChevronDown, ChevronRight, Settings, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navigationItems = [
    {
        id: 'nav-item1',
        icon: <Folders />,
        title: 'Boards',
        navigate: '/user/boards',
    },
    {
        id: 'nav-item2',
        icon: <LayoutTemplate />,
        title: 'Templates',
        navigate: '/user/templates',
    },
    {
        id: 'nav-item3',
        icon: <House />,
        title: 'Home',
        navigate: '/user/home',
    },
];

const workspaceItems = [
    {
        id: 'w-item1',
        icon: <Folders />,
        title: 'Boards',
        navigate: '/workspace/boards'
    },
    {
        id: 'w-item2',
        icon: <Users />,
        title: 'Members',
        navigate: '/workspace/members'
    },
    {
        id: 'w-item3',
        icon: <Settings />,
        title: 'Setting ',
        navigate: '/workspace/setting'
    },
]

interface Workspace {
    id: number;
    name: string;
    isExpanded?: boolean;
}

const Sidebar = () => {
    const location = useLocation();
    const [workspaces, setWorkSpaces] = useState<Workspace[]>([
        {
            id: 1,
            name: 'Nashtech',
            isExpanded: true,
        },
        {
            id: 2,
            name: 'Test',
            isExpanded: false,
        },
    ]);

    const toggleWorkspace = (workspaceId: number) => {
        setWorkSpaces(prevWorkspaces =>
            prevWorkspaces.map(workspace =>
                workspace.id === workspaceId
                    ? { ...workspace, isExpanded: !workspace.isExpanded }
                    : workspace
            )
        );
    };

    return (
        <div className='w-64 bg-[#1E2125] flex flex-col'>
            <div className='p-4'>
                {/* Navigation Items */}
                <nav className='space-y-1 border-b py-2'>
                    {navigationItems.map(item => (
                        <Link
                            to={item.navigate}
                            key={item.id}
                            className={clsx(
                                'flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#A6C5E229] font-medium rounded-lg transition-colors duration-200',
                                {
                                    'text-[#155DFC] bg-[#1C2B41]':
                                    item.navigate === location.pathname,
                                    'text-white' : 
                                    item.navigate !== location.pathname,
                                }
                            )}
                        >
                            {item.icon}
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Workspaces Section */}
            <div className='flex-1 px-4'>
                <div className='mb-4'>
                    <h3 className='text-xs font-semibold text-white uppercase tracking-wide mb-2'>
                        Workspaces
                    </h3>
                    {workspaces.map(workspace => (
                        <div className='space-y-1 mb-2' key={workspace.id}>
                            {/* Workspace Header */}
                            <div 
                                className='flex items-center justify-between p-2 hover:bg-[#A6C5E229] rounded-lg cursor-pointer transition-colors duration-200'
                                onClick={() => toggleWorkspace(workspace.id)}
                            >
                                <div className='flex items-center'>
                                    <div className='w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-black font-semibold text-sm mr-3'>
                                        {workspace.name.charAt(0)}
                                    </div>
                                    <span className='text-sm font-medium text-white'>
                                        {workspace.name}
                                    </span>
                                </div>
                                <div className='transition-transform duration-200'>
                                    {workspace.isExpanded ? (
                                        <ChevronDown className='w-4 h-4 text-gray-400' />
                                    ) : (
                                        <ChevronRight className='w-4 h-4 text-gray-400' />
                                    )}
                                </div>
                            </div>

                            {/* Workspace Submenu with Animation */}
                            <div 
                                className={clsx(
                                    'overflow-hidden transition-all duration-300 ease-in-out',
                                    workspace.isExpanded 
                                        ? 'max-h-32 opacity-100' 
                                        : 'max-h-0 opacity-0'
                                )}
                            >
                                <div className='space-y-1 pt-1'>
                                    {
                                        workspaceItems.map(item => (
                                            <Link
                                                key={item.id}
                                                to={item.navigate}
                                                className='flex items-center gap-2 pl-11 block px-3 py-1.5 text-xs text-white hover:bg-[#A6C5E229] rounded transition-colors duration-200'

                                            >
                                                {item.icon}
                                                {item.title}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;