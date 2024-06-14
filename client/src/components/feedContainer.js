import React from "react";
import Post from "./post";

function FeedContainer(){

    //example data
    const data = {
        username: "gant802",
        created_at: "12:45pm",
        content: "This is a sample post"
    }

    //example 
    let post_list = []
    for (let i = 0; i < 100 ; i++){
        post_list.push(data)
    }

    //example
    const postsListed = post_list.map((post, index) => {
        return <Post key={index} data={post}/>
    })

    return (
        <div id="feedContainer">
            {postsListed}
        </div>
    )
}

export default FeedContainer