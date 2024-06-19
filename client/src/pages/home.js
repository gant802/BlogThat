import React, {useState, useEffect} from "react";
import FeedContainer from "../components/feedContainer";
import NavBar from "../components/navbar";
import CreatePost from "../components/createPost";
import { useOutletContext } from "react-router-dom";

function Home(){
    const [loggedInUser, setLoggedInUser, posts, setPosts] = useOutletContext()
    const [toggleHome, setToggleHome] = useState(true)


    useEffect(() => {
        fetch('/following_posts')
        .then(response => response.json())
        .then(data => {
           setPosts(data) 
        })
        
    }, [toggleHome])


    return(
        <div>
            <NavBar toggleHome={toggleHome} setToggleHome={setToggleHome}/>
            <CreatePost posts={posts} 
            setPosts={setPosts}
            user={loggedInUser}/>
            <div id="lineBreak"></div>
            <FeedContainer user={loggedInUser} setPosts={setPosts} posts={posts}/>
        </div>
    )
}

export default Home