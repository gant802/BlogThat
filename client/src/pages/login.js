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

    function handleLogin(values) {
        fetch('http://127.0.0.1:5555/login', {
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
        <div id="loginContainer">
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
                        <form id="loginForm" onSubmit={handleSubmit}>
                            <label>Username: </label>
                            <input onChange={handleChange} value={username}
                                type="text" name="username" />

                            <label>Password: </label>
                            <input onChange={handleChange} value={password}
                                type="text" name="password" />

                            <label>Confirm Password: </label>
                            <input onChange={handleChange} value={password_confirmation}
                                type="text" name="password_confirmation" />

                            <button type="submit">Submit</button>
                        </form>
                    )
                }}
            </Formik>
                :
                <Register setUser={setUser} />}
            {!toggleForm ? <p>{error.error}</p> : ""}
            {!toggleForm ? <p>New User?</p> : ""}
            <p onClick={() => setToggleForm(!toggleForm)}>{!toggleForm ? "Create an Account" : "Go back to Login"}</p>
        </div>
    )
}

export default Login