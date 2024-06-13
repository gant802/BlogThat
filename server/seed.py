#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        
        User.query.delete()

        
        
        
        
        
        u1 = User(
            username = "dj",
            first_name = "Dan",
            last_name = "Jacoby",
            _password_hash = "1234",
            email = "dan@yahoo.com"

        )

        u2 = User(
            username = "gc",
            first_name = "Grant",
            last_name = "Cummings",
            _password_hash = "1254",
            email = "gc@yahoo.com",
            phone_number = 9543223453

        )

        db.session.add_all([u1,u2])
        db.session.commit()
