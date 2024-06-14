import React, {useState, useEffect} from "react";
import FeedContainer from "../components/feedContainer";
import NavBar from "../components/navbar";

function Home(){
    // const [posts, setPosts] = useState([]);

    // useEffect(() => {
    //     fetch('/users?')
    //     .then(res => res.json())
    //     .then(data => console.log(data))
    // }, [])



    return(
        <div>
            <NavBar />
            <FeedContainer />
        </div>
    )
}

export default Home