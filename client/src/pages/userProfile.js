import React, { useEffect, useState } from "react";
import NavBar from "../components/navbar";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import Post from "../components/post";

function UserProfile() {
    const [loggedInUser, setLoggedInUser] = useOutletContext()
    const [userProfile, setUserProfile] = useState({})
    const [toggleFollow, setToggleFollow] = useState(false)
    const [posts, setPosts] = useState([])
    const { id } = useParams()
    const navigate = useNavigate()

    // Sets user profile and posts based on the id parameter endpoint
    useEffect(() => {
        fetch(`/users/${id}`)
            .then(response => response.json())
            .then(data => {
                setUserProfile(data)
            })
        fetch(`/posts/user/${id}`)
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(data => {
                            setPosts(data)
                        })
                } else {
                    setPosts(null)
                    return console.log("no posts found")
                }
            })
    }, [id])

    // If you are on a non-user profile, this determines if the user is following them of not
    useEffect(() => {
        fetch(`/following/${id}`)
            .then(res => {
                if (res.ok) {
                    setToggleFollow(true)
                }
            })
    }, [])

    //? Function to log user out
    function logout() {
        fetch('/logout', {
            method: 'DELETE'
        }).then(resp => {
            if (resp.ok) {
                setLoggedInUser(null)
            }
        })
    }

    //? Function that allows you to follow the person who's profile you're on
    function followOrUnfollow(boolean) {
        if (boolean) {
            fetch(`/unfollow/${id}`, {
                method: 'DELETE'
            }).then(resp => {
                if (resp.ok) {
                    setToggleFollow(false)
                }
            })
        } else {
            fetch(`/following`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "user_id": id
                })
            }).then(resp => resp.json())
                .then(data => {
                    setToggleFollow(true)
                })
        }
    }




    // If there is post to diplay then it will display them but will show "User has no posts" otherwise
    let usersPostsListed = posts === null ? <h2 className="noPostsText">User has no posts yet!</h2> : posts.map((post, index) => {
        return <Post key={index} allPosts={posts} setPosts={setPosts} user={loggedInUser} data={post} />
    })

    function goToEditProfile(){
        navigate(`/editProfile/${loggedInUser.id}`)
    }


    return (
        <div>
            <NavBar />
            <div id="profileContainer">
                
                <div className="profileInfo">
                    <img className="userProfilePhoto" src={userProfile.profile_image ?
                        userProfile.profile_image :
                        "https://www.nevadahealthcenters.org/wp-content/uploads/2018/09/no-profile-picture.jpg"} alt="profile_photo" />
                    <h2 className="profileUsername">{`@${userProfile.username}`}</h2>
                    {id === loggedInUser.id.toString() ?
                        "" :
                        <button className="followButton" onClick={() => {
                            followOrUnfollow(toggleFollow)
                            setToggleFollow(!toggleFollow)
                        }}>{toggleFollow ? <span>Following &#10003;</span> : "Follow"}</button>}
                    {id === loggedInUser.id.toString() ? <button id="logoutButton" onClick={logout}>Logout</button> : ''}
                    {id === loggedInUser.id.toString() ? <button id="editProfileButton" onClick={goToEditProfile}>Edit Profile</button> : ''}
                </div>

                <div id="userPostsContainer">
                    {usersPostsListed}
                </div>
            </div>

        </div>
    )
}

export default UserProfile