import React from "react";
import { Formik } from 'formik';
import * as yup from 'yup';
import { Link } from "react-router-dom";



function Login() {

    function handleLogin(values) {
        console.log(values)
    }

    let loginSchema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
        password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required()
    })

    return (
        <div id="loginContainer">
            <h1>Login</h1>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    password_confirmation: ''
                }}
                validationSchema={loginSchema}
                onSubmit={handleLogin}>
                {(props) => {
                    console.log(props)
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
            <p>New User?</p>
            <Link to="/register">Create an Account</Link>
        </div>
    )
}

export default Login