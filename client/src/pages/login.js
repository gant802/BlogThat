import React, { useState } from "react";
import { Formik } from 'formik';
import * as yup from 'yup';
import Register from "./register";
import { useNavigate } from "react-router-dom";


function Login({ setUser }) {
    // Change back and forth from login form to create profile form
    const [toggleForm, setToggleForm] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    //? Function to handle a user loggin in
    function handleLogin(values) {
        fetch('/login', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(values)
        }).then((resp) => {
            if (resp.ok) {
                resp.json().then((user) => {
                    setUser(user);
                    navigate('/')
                });
            } else {
                resp.json().then((error) => {
                    setError(error);
                })
            }
        })
            .catch((error) => {
                setError(error);
            });
    }


    // Login schema makes sure two passwords match
    let loginSchema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
        password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required()
    })

    return (
        <div className="loginSignupContainer">
            <h1>{!toggleForm ? "Login" : "Create Your Account"}</h1>

            {!toggleForm ? <Formik
                initialValues={{
                    username: '',
                    password: '',
                    password_confirmation: ''
                }}
                validationSchema={loginSchema}
                onSubmit={handleLogin}>
                {(props) => {
                    const { values: { username, password, password_confirmation }, handleChange, handleSubmit, errors } = props
                    return (
                        <form className="loginSignupEditForm" onSubmit={handleSubmit}>
                            <label htmlFor="username">Username: </label>
                            <input id="username" onChange={handleChange} value={username}
                                type="text" name="username" />

                            <label htmlFor="password">Password: </label>
                            <input id="password" onChange={handleChange} value={password}
                                type="text" name="password" />

                            <label htmlFor="password_confirmation">Confirm Password: </label>
                            <input id="password_confirmation" onChange={handleChange} value={password_confirmation}
                                type="text" name="password_confirmation" />

                            <button type="submit">Submit</button>
                        </form>
                    )
                }}
            </Formik>
                :
                <Register setUser={setUser} />}

            {!toggleForm ? <p id="loginErrorText">{error.error}</p> : ""}
            {!toggleForm ? <p id="newUserText">New User?</p> : ""}
            
            <p id="toggleLoginCreateButton" onClick={() => setToggleForm(!toggleForm)}>{!toggleForm ? "Create an Account" : "Go back to Login"}</p>
        </div>
    )
}

export default Login