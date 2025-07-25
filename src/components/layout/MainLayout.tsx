import type { LayoutProps } from "@/types/user.types";

export const MainLayout: React.FC<LayoutProps> = ({
    children
}) => {
    return (
        <>
            <h1>Navbar</h1>
            {children}
        </>
    )
};
