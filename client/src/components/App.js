import React, { useEffect, useState } from "react";
import Login from "../pages/login";
import { Outlet } from "react-router-dom";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)

  return (
    <div>
    {
      !loggedInUser ?
      <Login /> :
      <Outlet />
    }
    </div>
  )
}

export default App;
