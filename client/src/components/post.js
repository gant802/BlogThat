import React from "react";

function Post({data}){
    return (
        <div id="postContainer">
            <div id="postHeaderContainer">
                <p>{data.username}</p>
                <p>{data.created_at}</p>
            </div>
            <div id="postContentContainer">
                <p>{data.content}</p>
            </div>
        </div>
    )
}

export default Post