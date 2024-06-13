import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./components/App";
import Home from "./pages/home";
import ReactDOM from 'react-dom/client';
import Register from "./pages/register";
// import routes from "./routes";

const routes = [
    {
        path: "/",
        element: <App />,
        children:[
            {
                path: "/",
                element: <Home />
            }
        ]
    },
    {
        path: "/register",
        element: <Register />
    }
]

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//       <RouterProvider router={router} />
//   );
