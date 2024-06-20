import React from "react";
import { Link } from "react-router-dom";

function UserNode({user}){

    
    return(
        <div className="singleUserNodeContainer">
            <img className="userNodeProfileImage" src={user.profile_image ? user.profile_image : "https://www.nevadahealthcenters.org/wp-content/uploads/2018/09/no-profile-picture.jpg"} alt="profile-img"/>
            <Link className="userNode" to={`/user/${user.id}`} key={user.id}>{"@" + user.username}</Link>
        </div>
    )
}

export default UserNode