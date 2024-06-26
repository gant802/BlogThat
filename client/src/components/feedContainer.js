import React from "react";
import Post from "./post";

function FeedContainer({ posts, user, setPosts }) {


    // Fixes map error bug that occurs when there is no posts yet
    let postsListed;
    if (posts) {
        postsListed = posts.map((post, index) => {
            return <Post key={index} allPosts={posts} setPosts={setPosts} user={user} data={post} />
        })
    }

    return (
        <div id="feedContainer">
            {!posts ? <h1>Loading...</h1> : postsListed}
        </div>
    )
}

export default FeedContainer