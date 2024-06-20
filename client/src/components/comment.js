import React from "react";

function Comment({ commentData, user, comments, setComments }) {

    function handleDeleteComment(){
        const commentId = commentData.id
        fetch(`comments/${commentId}`, {
            method: "DELETE"
            }).then(res => {
                const filteredComments = comments.filter(comment => comment.id !== commentId)
                setComments(filteredComments)
            })
    }

    return (
        <div>
            <div key={commentData.id} className="singleCommentContainer">
            <div className="singleCommentHeaderContainer">
                <p className="commentUsername">{"@" + commentData.user.username}</p>
                {commentData.user_id === user.id ? <button onClick={handleDeleteComment} className="deleteCommentButton">Delete</button> : ""}
            </div>
            <p className="commentContent">{commentData.comment}</p>
        </div>
        </div>
    )
}

export default Comment;