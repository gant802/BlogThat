import React, {useState} from "react";
import { Formik } from "formik";
import * as yup from 'yup';

function Post({allPosts, data, user, setPosts}){
    const [editToggle, setEditToggle] = useState(false)


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
    
    

    const editButton = user.id === data.user.id ?
    <button id="editPostButton" onClick={() => setEditToggle(!editToggle)}>Edit</button> :
    "";

    const editPostSchema = yup.object().shape({
        content: yup.string().max(150, 'Character limit reached!').required()
    })

    return (
        <div className="postContainer">
            <div className="postHeaderContainer">
                <p>{data.user.username}</p>
                {editButton}
                <p>{data.created_at}</p>
            </div>
            <div className="postContentContainer">
                {!editToggle ? <p>{data.content}</p> :
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
        </div>
    )
}

export default Post