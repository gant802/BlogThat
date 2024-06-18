import React, { useEffect, useState } from "react";
import NavBar from "../components/navbar";
import { useOutletContext, useParams } from "react-router-dom";
import Post from "../components/post";

function UserProfile() {
    const [loggedInUser, setLoggedInUser] = useOutletContext()
    const [userProfile, setUserProfile] = useState({})
    const [usersPosts, setUsersPosts] = useState([])
    const { id } = useParams()

    useEffect(() => {
        fetch(`/users/${id}`)
            .then(response => response.json())
            .then(data => {
                setUserProfile(data)
                console.log(data)
            })
        fetch(`/posts/user/${id}`)
            .then(response => response.json())
            .then(data => {
                setUsersPosts(data)
                console.log(data)
            })

    }, [id])

    function logoutTemp() {
        fetch('/logout', {
            method: 'DELETE'
        }).then(resp => {
            if (resp.ok) {
                setLoggedInUser(null)

            }
        })
    }

    // console.log(usersPosts)

    // const usersPostsListed = usersPosts.map(post => {
    //     return (
    //         <div classname="postContainer">
    //         <div className="postHeaderContainer">
    //             <p>{loggedInUser.username}</p>
    //             <p>{post.created_at}</p>
    //         </div>
    //         <div className="postContentContainer">
    //             <p>{post.content}</p>
    //         </div>
    //     </div>
    //     )
    // })

    return (
        <div>
            <NavBar />
            <div id="profileContainer">
                <img src={userProfile.profile_image ?
                    userProfile.profile_image :
                    "https://www.nevadahealthcenters.org/wp-content/uploads/2018/09/no-profile-picture.jpg"} alt="profile_photo" />
                <h2>{`${userProfile.username}'s Profile`}</h2>
                {id === loggedInUser.id.toString() ? <button onClick={logoutTemp}>Logout</button> : ''}
                <div id="userPostsContainer">
                    {/* {usersPostsListed} */}
                </div>
            </div>

        </div>
    )
}

export default UserProfile