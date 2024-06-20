import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./components/App";
import Home from "./pages/home";
import ReactDOM from 'react-dom/client';
import Search from "./pages/search";
import UserProfile from "./pages/userProfile";

// Frontend paths to render different pages of the application
const routes = [
    {
        path: "/",
        element: <App />,
        children:[
            {
                path: "/",
                element: <Home />
            },
            {
                path: "search",
                element: <Search />
            },
            {
                path: "user/:id",
                element: <UserProfile />
            }
        ]
    },
]

// Create a router using the 'createBrowserRouter' function and pass the 'routes' configuration
const router = createBrowserRouter(routes);

// Render the application by providing the router to the RouterProvider component
ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

