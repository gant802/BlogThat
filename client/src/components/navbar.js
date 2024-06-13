import React from "react";
import { NavLink } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function NavBar(){

    const [loggedInUser] = useOutletContext()
    

    return (
        <div id="navbarContainer">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/search">Search</NavLink>
            <NavLink to={`/user/${loggedInUser.id}`}>My profile</NavLink>
        </div>
    )
}

export default NavBar