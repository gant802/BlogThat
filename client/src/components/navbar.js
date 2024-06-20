import React from "react";
import { NavLink } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function NavBar({ toggleHome, setToggleHome }) {

    const [loggedInUser] = useOutletContext()

    // The onClick for changing the toggleHome is a dependency for a useEffect on the home page to set posts
    return (
        <div id="navbarContainer">
            <h1 id="blogThat">BlogThat<span>&rarr;</span></h1>
            <div id="navbarInnerContainer">
                <NavLink onClick={() => setToggleHome(!toggleHome)} className="navbarButtons" to="/">Home</NavLink>
                <NavLink className="navbarButtons" to="/search">Search</NavLink>
                <NavLink className="navbarButtons" to={`/user/${loggedInUser.id}`}>My profile</NavLink>
            </div>
        </div>
    )
}

export default NavBar