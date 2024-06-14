import React, { useEffect, useState } from "react";
import NavBar from "../components/navbar";
import { useOutletContext, useParams } from "react-router-dom";

function UserProfile() {
    const [loggedInUser, setLoggedInUser] = useOutletContext()
    const [userProfile, setUserProfile] = useState({})
    const { id } = useParams()

    useEffect(() => {
        fetch(`http://127.0.0.1:5555/users/${id}`)
        .then(response => response.json())
        .then(data => {
            setUserProfile(data)
        })
    }, [id])

    function logoutTemp() {
        fetch('http://127.0.0.1:5555/logout', {
            method: 'DELETE'
        }).then( resp => {
            if (resp.ok) {
                setLoggedInUser(null)
            }
        })
    }
    console.log(loggedInUser.id)
    console.log(id)

    return (
        <div>
            <NavBar />
            <h2>{`${userProfile.username}'s Profile`}</h2>
            {id === loggedInUser.id.toString() ? <button onClick={logoutTemp}>Logout</button> : ''}
        </div>
    )
}

export default UserProfile