import React, {useEffect, useState} from "react";
import { Formik } from "formik";
import * as yup from 'yup';

function Comments({postData, user}){
    const [comments, setComments] = useState([]);

    console.log(postData.id)

    useEffect(() => {
        fetch(`/comments/post/${postData.id}`)
        .then(resp => {
            if(resp.ok){
                resp.json().then(data => setComments(data))
            }
        })
    }, [])

    function handlePostComment(values){
        fetch(`/comment/${postData.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        }).then(res => res.json())
        .then(data => setComments([data, ...comments]))
    }

    const commentSchema = yup.object().shape({
        comment: yup.string().max(100, 'Character limit reached!').required("Comment can't be blank!")
    })

    const commentsListed = comments.map(comment => {
        return (
            <div key={comment.id} className="singleCommentContainer">
                    <p className="commentUsername">{"@" + comment.user.username}</p>
                <p className="commentContent">{comment.comment}</p>
                </div>
        )
    })

    return(
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
                    const { values: {comment}, handleChange, handleSubmit, errors } = props
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

export default Comments