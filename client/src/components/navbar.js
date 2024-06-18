import React from "react";
import { NavLink } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function NavBar({toggleHome, setToggleHome}){

    const [loggedInUser] = useOutletContext()

    return (
        <div id="navbarContainer">
            <div id="navbarInnerContainer">
                <NavLink onClick={() => setToggleHome(!toggleHome)} className="navbarButtons" to="/">Home</NavLink>
                <NavLink className="navbarButtons" to="/search">Search</NavLink>
                <NavLink className="navbarButtons" to={`/user/${loggedInUser.id}`}>My profile</NavLink>
            </div>
        </div>
    )
}

export default NavBar