import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="h-screen w-screen">
            <Outlet />
        </div>
    )
};

export default AuthLayout;