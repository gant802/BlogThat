import React, { useState, useEffect } from "react";
import FeedContainer from "../components/feedContainer";
import NavBar from "../components/navbar";
import CreatePost from "../components/createPost";
import { useOutletContext } from "react-router-dom";

function Home() {
    const [loggedInUser] = useOutletContext()
    const [toggleHome, setToggleHome] = useState(true)
    const [feed, setFeed] = useState([])

    // Fetches the users posts to render to there feed(as well as the user's posts)
    useEffect(() => {
        fetch('/following_posts')
            .then(response => response.json())
            .then(data => {
                setFeed(data)
            })

    }, [toggleHome])
    //! ^^^^^^^^^^ dependency to set the posts whenever "Home" is clicked on the navbar

    return (
        <div>
            <NavBar toggleHome={toggleHome} setToggleHome={setToggleHome} />

            <CreatePost posts={feed}
                setPosts={setFeed}
                user={loggedInUser} />
                
            <div id="lineBreak"></div>
            <FeedContainer user={loggedInUser} setPosts={setFeed} posts={feed} />
        </div>
    )
}

export default Home