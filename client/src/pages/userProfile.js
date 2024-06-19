import React, { useEffect, useState } from "react";
import NavBar from "../components/navbar";
import { useOutletContext, useParams } from "react-router-dom";
import Post from "../components/post";

function UserProfile() {
    const [loggedInUser, setLoggedInUser, posts, setPosts] = useOutletContext()
    const [userProfile, setUserProfile] = useState({})
    const [toggleFollow, setToggleFollow] = useState(false)
    const { id } = useParams()

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

    useEffect(() => {
        fetch(`/following/${id}`)
            .then(res => {
                if (res.ok) {
                    console.log("res.ok")
                    setToggleFollow(true)
                }
            })
    }, [])

    function logoutTemp() {
        fetch('/logout', {
            method: 'DELETE'
        }).then(resp => {
            if (resp.ok) {
                setLoggedInUser(null)
            }
        })
    }

    function followOrUnfollow(boolean){
        if(boolean){
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
                body: JSON.stringify({ "user_id": id
                 })
            }).then(resp => resp.json())
            .then(data => {
                setToggleFollow(true)
            })
        }
    }





    let usersPostsListed = posts === null ? <h2 className="noPostsText">User has no posts yet!</h2> : posts.map((post, index) => {
        return <Post key={index} allPosts={posts} setPosts={setPosts} user={loggedInUser} data={post} />
    })


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
                    }}>{toggleFollow ? <span>Following &#10003;</span> : "Follow" }</button>}
                {id === loggedInUser.id.toString() ? <button id="logoutButton" onClick={logoutTemp}>Logout</button> : ''}  
                </div>
                
                <div id="userPostsContainer">
                    {usersPostsListed}
                </div>
            </div>

        </div>
    )
}

export default UserProfile