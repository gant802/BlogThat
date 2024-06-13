import React from "react";
import FeedContainer from "../components/feedContainer";
import NavBar from "../components/navbar";

function Home(){


    return(
        <div>
            <NavBar />
            <h1>Home</h1>
            <FeedContainer />
        </div>
    )
}

export default Home