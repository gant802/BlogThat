import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./components/App";
import Home from "./pages/home";
import ReactDOM from 'react-dom/client';
import Search from "./pages/search";
import UserProfile from "./pages/userProfile";
// import routes from "./routes";

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
                path: "/user/:id",
                element: <UserProfile />
            }
        ]
    },
]

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//       <RouterProvider router={router} />
//   );
