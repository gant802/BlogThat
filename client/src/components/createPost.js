import React from "react";
import { Formik } from "formik";
import * as yup from 'yup';

function CreatePost({ setPosts, posts, user }) {

    function handleFormSubmit(values) {
        console.log(values);
        fetch('/posts', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(values)
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(data => {
                console.log(data)
                setPosts([data, ...posts])
                })
                
            }
        })
    }

    let createPostSchema = yup.object().shape({
        content: yup.string().max(150, 'Character limit reached!').required()
    })

    return (
        <div id="createPostContainer">
            <h2>What's on your mind?</h2>
            <Formik
                initialValues={{
                    content: "",
                    user_id: user.id
                }}
                validationSchema={createPostSchema}
                onSubmit={handleFormSubmit}
            >
                {(props) => {
                    const { values: {content}, handleChange, handleSubmit, errors } = props
                    return (<form id="createPostForm" onSubmit={handleSubmit}>
                        <label>What's on your mind?</label>
                        <input onChange={handleChange} value={content}
                            type="text" name="content" />
                        <div>
                            <button type="submit">Create Post</button>
                        </div>
                    </form>)
                }}
            </Formik>
        </div>
    )
}

export default CreatePost