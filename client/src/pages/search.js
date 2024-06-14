import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import { Link } from "react-router-dom";

function Search() {
    const [allUsers, setAllUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:5555/users')
            .then(response => response.json())
            .then(data => setAllUsers(data))
    }, [])

    let filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredUsers = searchTerm === '' ? [] : filteredUsers;


    return (
        <div>
            <NavBar />
            <h2>Search Page</h2>
            <input
                type="text"
                placeholder="Search for users by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredUsers.map((user) => (
                    <Link to={`/user/${user.id}`} key={user.id}>{user.username}</Link>
                ))}
            </ul>
        </div>
    )
}

export default Search