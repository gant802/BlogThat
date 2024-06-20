import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from 'yup';
import Comment from "./comment";

function CommentsContainer({ postData, user }) {
    const [comments, setComments] = useState([]);

    // Fetch all comments for the post they are linked to
    useEffect(() => {
        fetch(`/comments/post/${postData.id}`)
            .then(resp => {
                if (resp.ok) {
                    resp.json().then(data => setComments(data))
                }
            })
    }, [])

    //? Handles posting a comment on a post that persists
    function handlePostComment(values) {
        fetch(`/comment/${postData.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        }).then(res => res.json())
            .then(data => setComments([...comments, data]))
    }


    // Lists out all of the comments for a post
    const commentsListed = comments.map(comment => {
        return ( <Comment key={comment.id} commentData={comment} user={user} comments={comments} setComments={setComments}/>
        )
    })

    // Schema to validate the comment you want to post
    const commentSchema = yup.object().shape({
        comment: yup.string().max(100, 'Character limit reached!').required("Comment can't be blank!")
    })

    return (
        <div className="commentsAndFormContainer">

            <div className="commentFormContainer">
                <Formik
                    initialValues={{
                        comment: ""
                    }}
                    validationSchema={commentSchema}
                    onSubmit={handlePostComment}
                >
                    {(props) => {
                        const { values: { comment }, handleChange, handleSubmit, errors } = props
                        return (<form id="commentForm" onSubmit={handleSubmit}>
                            <textarea onChange={handleChange} value={comment}
                                type="text" name="comment" />
                            {errors.comment}
                            <div>
                                <button className="addCommentButton" type="submit">Add Comment</button>
                            </div>
                        </form>)
                    }}
                </Formik>
            </div>

            <div className="commentsContainer">
                {commentsListed}
            </div>
        </div>
    )
}

export default CommentsContainer