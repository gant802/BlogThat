import React from "react";
import { Formik } from "formik";
import * as yup from 'yup'
import { useNavigate } from "react-router-dom";

function Register({ setUser }) {
    const navigate = useNavigate()

    //? Function to handle registering as a user
    function handleSignupSubmit(values) {
        fetch('/signup', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(values)
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(user => {
                    setUser(user)
                    navigate('/')
                })
            }
        })

    }

    // Schema to validate user input for signing up
    let createProfileSchema = yup.object().shape({
        first_name: yup.string().required(),
        last_name: yup.string().required(),
        username: yup.string().max(20, 'Username too Long!').required(),
        password: yup.string().max(20, 'Password too Long!').required(),
        password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(),
        profile_image: yup.string(),
        email: yup.string().email().required(),
        birthday: yup.string(),
        phone_number: yup.number()
    })

    return (
        <div className="loginSignupContainerr">

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
                onSubmit={handleSignupSubmit}
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
                    return (<form className="loginSignupForm" onSubmit={handleSubmit}>
                        <p>*required fields</p>
                        <label>*First Name: </label>
                        <input onChange={handleChange} value={first_name}
                            type="text" name="first_name" />
                        <p className="errorText">{errors.first_name}</p>

                        <label>*Last Name: </label>
                        <input onChange={handleChange} value={last_name}
                            type="text" name="last_name" />
                        <p className="errorText">{errors.last_name}</p>

                        <label>*Username: </label>
                        <input onChange={handleChange} value={username}
                            type="text" name="username" />
                        <p className="errorText">{errors.username}</p>

                        <label>*Password: </label>
                        <input onChange={handleChange} value={password}
                            type="text" name="password" />
                        <p className="errorText">{errors.password}</p>

                        <label>*Confirm Password: </label>
                        <input onChange={handleChange} value={password_confirmation}
                            type="text" name="password_confirmation" />
                        <p className="errorText">{errors.password_confirmation}</p>

                        <label>Profile Picture URL: </label>
                        <input onChange={handleChange} value={profile_image}
                            type="text" name="profile_image" />

                        <label>*Email Address: </label>
                        <input onChange={handleChange} value={email}
                            type="email" name="email" />
                        <p className="errorText">{errors.email}</p>

                        <label>Birthday: </label>
                        <input onChange={handleChange} value={birthday}
                            type="date" name="birthday" />

                        <label>Phone Number: </label>
                        <input onChange={handleChange} value={phone_number}
                            type="integer" name="phone_number" />
                        <p className="errorText">{errors.phone_number}</p>

                        <button type="submit">Create Profile</button>

                    </form>)
                }}
            </Formik>

        </div>
    )
}

export default Register