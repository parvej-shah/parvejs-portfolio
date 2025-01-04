import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../pages/MainLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children:[
            {
                path:'/',
                index:true,
                element:<Home/>
            },
        ]
    },
/*     {
        path:'/*',
        element:<ErrorPage/>
    } */
    ]);

export default router;

