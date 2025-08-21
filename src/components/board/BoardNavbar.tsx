import { Activity, Copy, EarthIcon, Eye, Folder, Image, Settings, Tag, Users, X, type Earth } from 'lucide-react';
import React, { useState } from 'react';

const BoardNavbar = () => {

    const [showMenu, setShowMenu] = useState(false);

    const menuItems = [
        { icon: <Users />, label: "Share", color: "text-gray-300" },
        { icon: <EarthIcon />, label: "Visibility: Workspace", color: "text-gray-300" },
        { icon: <Settings />, label: "Settings", color: "text-gray-300" },
        { icon: <Image />, label: "Change background", color: "text-gray-300" },
    ];

    const powerUpItems = [
        { icon: <Tag />, label: "Labels", color: "text-gray-300" },
        { icon: <Activity />, label: "Activity", color: "text-gray-300" },
        { icon: <Folder />, label: "Archived items", color: "text-gray-300" },
    ];

    const moreItems = [
        { icon: <Eye />, label: "Watch", color: "text-gray-300" },
        { icon: <Copy />, label: "Copy board", color: "text-gray-300" },
        { icon: <X />, label: "Close board", color: "text-red-400" },
    ];

    return (
        <div className='h-[50px] flex items-center justify-between bg-[#28303E] p-4'>
            <h1 className='text-xl font-bold text-white mb-2'>
                Smart TaskHub
            </h1>
            {/* Folder Menu Button */}
            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center justify-center w-8 h-8 text-white hover:bg-[#3A4150] rounded transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Menu Modal */}
                {showMenu && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowMenu(false)}
                        />

                        {/* Menu */}
                        <div className="absolute right-0 top-10 w-80 bg-[#2c3e50] rounded-lg shadow-xl z-50 border border-gray-600">
                            {/* Menu Header */}
                            <div className="flex items-center justify-between p-3 border-b border-gray-600">
                                <span className="text-white font-medium text-sm">Menu</span>
                                <button
                                    onClick={() => setShowMenu(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Menu Content */}
                            <div className="p-2">
                                {/* Main Menu Items */}
                                {menuItems.map((item, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-[#34495e] transition-colors text-left"
                                    >
                                        <span className="mr-3 text-base text-white">{item.icon}</span>
                                        <div className="flex-1">
                                            <div className={`${item.color}`}>
                                                {item.label}
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                {/* Divider */}
                                <div className="border-t border-gray-600 my-2"></div>

                                {/* Power-Ups Section */}
                                {powerUpItems.map((item, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-[#34495e] transition-colors text-left"
                                    >
                                        <span className="mr-3 text-base text-white">{item.icon}</span>
                                        <div className="flex-1">
                                            <div className={item.color}>
                                                {item.label}
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                {/* Divider */}
                                <div className="border-t border-gray-600 my-2"></div>

                                {/* More Items */}
                                {moreItems.map((item, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-[#34495e] transition-colors text-left"
                                    >
                                        <span className="mr-3 text-base text-white">{item.icon}</span>
                                        <div className="flex-1">
                                            <div className={item.color}>
                                                {item.label}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default BoardNavbar;
