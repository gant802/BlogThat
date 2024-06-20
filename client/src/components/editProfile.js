import React from "react";
import NavBar from "./navbar";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from 'yup'

function EditProfile() {
    const navigate = useNavigate()
    const [loggedInUser, setLoggedInUser] = useOutletContext()
    console.log(loggedInUser)


    function handleEditSubmit(values) {
        const valuesCopy = Object.assign({}, values);
        for (const key in valuesCopy) {
            if (valuesCopy[key] === '') {
                delete valuesCopy[key]
            }
        }
        
        fetch(`/users/${loggedInUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(valuesCopy)
        }).then(res => res.json())
        .then(data => {
            setLoggedInUser(() => data)
            navigate(`/user/${loggedInUser.id}`)
        })
    }

    function goBackToProfile() {
        navigate(`/user/${loggedInUser.id}`)
    }

    function handleDeleteProfile(){
        console.log("delete")
        fetch(`/users/${loggedInUser.id}`, {
            method: 'DELETE'
        }).then(res => {
            if(res.ok){
                setLoggedInUser(null)
                navigate('/')
            }
        })
    }


    // Schema to validate user input for editing profile
    let createProfileSchema = yup.object().shape({
        first_name: yup.string().required(),
        last_name: yup.string().required(),
        username: yup.string().max(20, 'Username too Long!').required(),
        password: yup.string().max(20, 'Password too Long!'),
        password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
        profile_image: yup.string(),
        email: yup.string().email().required(),
        birthday: yup.string(),
        phone_number: yup.number()
    })


    return (
        <div>
            <NavBar />

            <div id="editProfileFormContainer">
                <h1>Edit Profile</h1>
                <Formik
                    initialValues={{
                        first_name: loggedInUser.first_name,
                        last_name: loggedInUser.last_name,
                        username: loggedInUser.username,
                        password: "",
                        password_confirmation: "",
                        profile_image: loggedInUser.profile_image,
                        email: loggedInUser.email,
                        birthday: loggedInUser.birthday,
                        phone_number: loggedInUser.phone_number
                    }}
                    validationSchema={createProfileSchema}
                    onSubmit={handleEditSubmit}
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
                        return (<form className="loginSignupEditForm" onSubmit={handleSubmit}>
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

                            <label>*Password (Fill out only if you want it changed): </label>
                            <input onChange={handleChange} value={password}
                                type="text" name="password" />
                            <p className="errorText">{errors.password}</p>

                            <label>*Confirm Password (Fill out only if you want it changed): </label>
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

                            <div id="saveChangesDeleteContainer">
                                <button id="saveChangesButton" type="submit">Save Changes</button>
                                <button id="deleteProfileButton" type="button" onClick={handleDeleteProfile}>Delete Profile</button>
                            </div>
                            

                        </form>)
                    }}
                </Formik>
                <p id="goBackToProfile" onClick={goBackToProfile}>Go back to my profile</p>
            </div>

        </div>
    )
}

export default EditProfile