import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import { useOutletContext } from "react-router-dom";
import UserNode from "../components/userNode";

function Search() {
    const [loggedInUser] = useOutletContext()
    const [allUsers, setAllUsers] = useState([])
    const [userFollowing, setUserFollowing] = useState([])
    const [userFollowers, setUserFollowers] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [toggleFollows, setToggleFollows] = useState("search");

    console.log(toggleFollows)

    useEffect(() => {
        fetch('/users')
            .then(response => response.json())
            .then(data => setAllUsers(data))
        fetch('/following')
            .then(response => response.json())
            .then(data => setUserFollowing(data))
        fetch(`/followers/${loggedInUser.id}`)
            .then(response => response.json())
            .then(data => setUserFollowers(data))
    }, [])


    let filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredUsers = searchTerm === '' ? [] : filteredUsers;


    return (
        <div>
            <NavBar />
            <div id="searchPageContainer">
                <div id="searchBarContainer">
                    <input
                        id="searchInput"
                        type="text"
                        placeholder="Search for users by username..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setToggleFollows("search")
                        }}
                    />
                    <button id="searchButton">Search</button>
                </div>

                <div id="followersFollowingContainer">
                    <h2 onClick={() => setToggleFollows("showFollowing")}>Following</h2>
                    <h2 onClick={() => setToggleFollows("showFollowers")}>Followers</h2>
                </div>
                <div id="userNodeContainer">
                    {toggleFollows == "search" ? filteredUsers.map((user, index) => (
                        <UserNode key={index} user={user} />
                    )) :
                        ""}
                    {toggleFollows == "showFollowers" ?
                        userFollowers.map((user, index) => (
                            <UserNode key={index} user={user} />
                        )) : ""}
                    {toggleFollows == "showFollowing" ?
                        userFollowing.map((user, index) => (
                            <UserNode key={index} user={user} />
                        )) :
                        ""}
                </div>

            </div>

        </div>
    )
}

export default Search