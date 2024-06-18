import React from "react";
import Post from "./post";

function FeedContainer({posts, user, setPosts}){

    const postsListed = posts.map((post, index) => {
        return <Post key={index} allPosts={posts} setPosts={setPosts} user={user} data={post}/>
    })

    

    return (
        <div id="feedContainer">
            {!posts ? <h1>Loading...</h1> : postsListed}
        </div>
    )
}

export default FeedContainer