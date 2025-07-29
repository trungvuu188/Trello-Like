import type { LayoutProps } from "@/types/user.types";

export const MainLayout: React.FC<LayoutProps> = ({
    children
}) => {
    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    )
};