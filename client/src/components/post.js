import React from "react";

function Post({data}){
    return (
        <div className="postContainer">
            <div className="postHeaderContainer">
                <p>{data.user.username}</p>
                <p>{data.created_at}</p>
            </div>
            <div className="postContentContainer">
                <p>{data.content}</p>
            </div>
        </div>
    )
}

export default Post