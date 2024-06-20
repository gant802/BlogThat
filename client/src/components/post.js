import React, {useState} from "react";
import { Formik } from "formik";
import * as yup from 'yup';
import Comments from "./comments";

function Post({allPosts, data, user, setPosts}){
    const [editToggle, setEditToggle] = useState(false)
    const [toggleComments, setToggleComments] = useState(false)

    function handleEditPost(values){
        fetch(`http://127.0.0.1:5555/posts/${data.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
            })
            .then(response => {
                if(response.ok) {
                    response.json()
            .then(responseData => {
                const refreshedPosts = allPosts.map(post => {
                    if (post.id === responseData.id) {
                        return responseData;
                    }
                    return post;
                });
                setEditToggle(false)
                setPosts(() => refreshedPosts)
            })
                } 
            })
            .catch(error => console.log(error))
        }

    function handleDeletePost(){
        fetch(`/posts/${data.id}`, {
            method: "DELETE",
        }).then(() => {
            const updatedPosts = allPosts.filter(post => post.id !== data.id);
            setPosts(updatedPosts);
        })
    }
    
    

    const editPostButton = user.id === data.user.id ?
    <button className="editDeleteButton" onClick={() => setEditToggle(!editToggle)}>Edit</button> :
    "";

    const deletePostButton = user.id === data.user.id ?
    <button className="editDeleteButton" onClick={() => handleDeletePost()}>Delete</button> :
    "";

    const editPostSchema = yup.object().shape({
        content: yup.string().max(150, 'Character limit reached!').required()
    })

    return (
        <div className="postContainer">
            <div className="postHeaderContainer">
                <p>{"@" + data.user.username}</p>
                {editPostButton}
                {deletePostButton}
                <p>{data.created_at}</p>
            </div>
            <div className="postContentContainer">
                {!editToggle ? <p className="postText">{data.content}</p> :
                <Formik
                initialValues={{
                    content: data.content,
                }}
                validationSchema={editPostSchema}
                onSubmit={handleEditPost}
            >
                {(props) => {
                    const { values: {content}, handleChange, handleSubmit, errors } = props
                    return (<form id="editPostForm" onSubmit={handleSubmit}>
                        <textarea onChange={handleChange} value={content}
                            type="text" name="content" />
                        <div>
                            <button type="submit">Save</button>
                        </div>
                    </form>)
                }}
            </Formik>}
            </div>
            <div className="commentPostDivider"></div>
            <button className="seeComments" onClick={() => setToggleComments(!toggleComments)}>{toggleComments ? "Hide Comments" : "See Comments"}</button>
            {toggleComments ? <Comments user={user} postData={data}/> : ""}
        </div>
    )
}

export default Post