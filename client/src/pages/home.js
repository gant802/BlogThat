import React, { useState, useEffect } from "react";
import FeedContainer from "../components/feedContainer";
import NavBar from "../components/navbar";
import CreatePost from "../components/createPost";
import { useOutletContext } from "react-router-dom";

function Home() {
    const [loggedInUser, setLoggedInUser, posts, setPosts] = useOutletContext()
    const [toggleHome, setToggleHome] = useState(true)

    // Fetches the users posts to render to there feed(as well as the user's posts)
    useEffect(() => {
        fetch('/following_posts')
            .then(response => response.json())
            .then(data => {
                setPosts(data)
            })

    }, [toggleHome])
    //! ^^^^^^^^^^ dependency to set the posts whenever "Home" is clicked on the navbar

    return (
        <div>
            <NavBar toggleHome={toggleHome} setToggleHome={setToggleHome} />

            <CreatePost posts={posts}
                setPosts={setPosts}
                user={loggedInUser} />
                
            <div id="lineBreak"></div>
            <FeedContainer user={loggedInUser} setPosts={setPosts} posts={posts} />
        </div>
    )
}

export default Home