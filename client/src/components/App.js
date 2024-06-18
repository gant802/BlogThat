import React, { useEffect, useState } from "react";
import Login from "../pages/login";
import { Outlet } from "react-router-dom";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    fetch('/check_session')
    .then(resp => {
      if (resp.ok) {
        resp.json().then(data => setLoggedInUser(data))
      }
    })
  }, [])

  return (
    <div id="body">
    {
      !loggedInUser ?
      <Login setUser={setLoggedInUser}/> :
      <Outlet context={[loggedInUser, setLoggedInUser]}/>
    }
    </div>
  )
}

export default App;
