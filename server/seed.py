#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Post, Follow

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        
        User.query.delete()
        Post.query.delete()
        Follow.query.delete()

        print("Creating Users...")
        users = []
        usernames = []
        for i in range(50):

            username = fake.first_name()
            while username in usernames:
                username = fake.user_name()

            usernames.append(username)
            user = User(username=username, 
                        first_name=fake.first_name(),
                        last_name=fake.last_name(),
                        email=fake.email(),
                        _password_hash="password"
            )
            users.append(user)
        db.session.add_all(users)
        db.session.commit()



        posts = [
            Post(content="This is the first post", user_id=users[2].id),
            Post(content="This is the second post", user_id=users[2].id),
            Post(content="This is the third post", user_id=users[2].id),
            Post(content="This is the fourth post", user_id=users[0].id),
            Post(content="This is the fifth post", user_id=users[21].id)
        ]

        # Add all posts to the session
        db.session.add_all(posts)
        db.session.commit()

        
        #follower_user_id=users[1].id

        follows = [
            Follow(following_user_id=users[1].id,follower_user_id=users[2].id),
            Follow(following_user_id=users[1].id,follower_user_id=users[3].id),
            Follow(following_user_id=users[2].id,follower_user_id=users[1].id),
            Follow(following_user_id=users[2].id,follower_user_id=users[3].id),
            Follow(following_user_id=users[1].id,follower_user_id=users[4].id)
        ]
        db.session.add_all(follows)
        db.session.commit()






        


        
        # u1 = User(
        #     username = "dj",
        #     first_name = "Dan",
        #     last_name = "Jacoby",
        #     _password_hash = "1234",
        #     email = "dan@yahoo.com"

        # )

        # u2 = User(
        #     username = "gc",
        #     first_name = "Grant",
        #     last_name = "Cummings",
        #     _password_hash = "1254",
        #     email = "gc@yahoo.com",
        #     phone_number = 9543223453

        # )

        # db.session.add_all([u1,u2])
        # db.session.commit()
