import AuthLayout from "@/components/layout/AuthLayout";
import Login from "@/pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        path: '/',
        errorElement: '',
        children: [
            {
                index: true,
                path: 'login',
                element: <Login />
            }
        ]
    }
]);

const Index = () => {
    return <RouterProvider router={router} />
};

export default Index;