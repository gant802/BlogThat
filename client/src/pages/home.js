import React, {useState, useEffect} from "react";
import FeedContainer from "../components/feedContainer";
import NavBar from "../components/navbar";
import CreatePost from "../components/createPost";
import { useOutletContext } from "react-router-dom";

function Home(){
    const [posts, setPosts] = useState([]);
    const [loggedInUser, setLoggedInUser] = useOutletContext()

    useEffect(() => {
        fetch('/follower_posts')
        .then(res => res.json())
        .then(data => setPosts(data))
    }, [])



    return(
        <div>
            <NavBar />
            <CreatePost posts={posts} 
            setPosts={setPosts}
            user={loggedInUser}/>
            <FeedContainer posts={posts}/>
        </div>
    )
}

export default Home