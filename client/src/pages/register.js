import React from "react";
import { Formik } from "formik";
import * as yup from 'yup'
import { useNavigate } from "react-router-dom";

function Register() {
   const navigate = useNavigate()

    function handleFormSubmit(values) {
        console.log(values)
        navigate('/')
    }

    let createProfileSchema = yup.object().shape({
        first_name: yup.string().required(),
        last_name: yup.string().required(),
        username: yup.string().min(5, 'Username too Short!').max(20, 'Username too Long!').required(),
        password: yup.string().min(5, 'Password too Short!').max(20, 'Password too Long!').required(),
        password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(),
        profile_image: yup.string(),
        email: yup.string().email().required(),
        birthday: yup.string(),
        phone_number: yup.number()
    })

    return (
        <div id="createProfileContainer">
            <h2>Create your Profile</h2>
            <Formik
                initialValues={{
                    first_name: "",
                    last_name: "",
                    username: "",
                    password: "",
                    password_confirmation: "",
                    profile_image: "",
                    email: "",
                    birthday: "",
                    phone_number: ""
                }}
                validationSchema={createProfileSchema}
                onSubmit={handleFormSubmit}
            >
                {(props) => {
                    console.log(props)
                    const { values: { 
                        first_name,
                        last_name,
                        username,
                        password,
                        password_confirmation,
                        profile_image,
                        email,
                        birthday,
                        phone_number
                        },
                        handleChange, handleSubmit, errors } = props
                    return (<form id="createProfileForm" onSubmit={handleSubmit}>
                        <label>First Name: </label>
                        <input onChange={handleChange} value={first_name}
                            type="text" name="first_name" />

                        <label>Last Name: </label>
                        <input onChange={handleChange} value={last_name}
                            type="text" name="last_name" />

                        <label>Username: </label>
                        <input onChange={handleChange} value={username}
                            type="text" name="username" />
                        {errors.username}

                        <label>Password: </label>
                        <input onChange={handleChange} value={password}
                            type="text" name="password" />
                        
                        <label>Confirm Password: </label>
                        <input onChange={handleChange} value={password_confirmation}
                            type="text" name="password_confirmation" />

                        <label>Profile Picture URL: </label>
                        <input onChange={handleChange} value={profile_image}
                            type="text" name="profile_image" />

                        <label>Email Address: </label>
                        <input onChange={handleChange} value={email}
                            type="email" name="email" />

                        <label>Birthday: </label>
                        <input onChange={handleChange} value={birthday}
                            type="date" name="birthday" />
                        
                        <label>Phone Number: </label>
                        <input onChange={handleChange} value={phone_number}
                            type="text" name="phone_number" />

                        <div>
                            <button type="submit">Create Profile</button>
                        </div>

                    </form>)
                }}
            </Formik>
        </div>
    )
}

export default Register