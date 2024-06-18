import React from "react";
import { Formik } from "formik";
import * as yup from 'yup';

function CreatePost() {

    function handleFormSubmit(values) {
        console.log(values);
        //Logic for posting to a certain route
    }

    let createPostSchema = yup.object().shape({
        content: yup.string().max(150, 'Character limit reached!').required()
    })

    return (
        <div id="createPostContainer">
            <h2>What's on your mind?</h2>
            <Formik
                initialValues={{
                    content: ""
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