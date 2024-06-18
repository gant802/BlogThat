import React from "react";
import { Link } from "react-router-dom";

function UserNode({user}){
    return(
        <div>
            <Link to={`/user/${user.id}`} key={user.id}>{user.username}</Link>
        </div>
    )
}

export default UserNode