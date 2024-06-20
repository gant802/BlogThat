import React, { useEffect, useState } from "react";
import Login from "../pages/login";
import { Outlet } from "react-router-dom";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [posts, setPosts] = useState([]);

  // Checks if a user is already logged in based on if there is a user_id cookie in the browser
  useEffect(() => {
    fetch('/check_session')
      .then(resp => {
        if (resp.ok) {
          resp.json().then(data => setLoggedInUser(data))
        }
      })
  }, [])

  // Conditionally render the login page or home page depending if there is a user logged in or not
  return (
    <div id="body">
      {
        loggedInUser ?
          <Outlet context={[loggedInUser, setLoggedInUser, posts, setPosts]} /> :
          <Login setUser={setLoggedInUser} />
      }
    </div>
  )
}

export default App;
