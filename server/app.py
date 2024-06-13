#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from models import User
from config import app, db, api, bcrypt

# Local imports
from config import app, db, api
# Add your model imports


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class SignUp(Resource):
    def post(self):
        params = request.json
        try:
            user = User(
                username=params.get('username'),
                first_name=params.get('first_name'),
                last_name=params.get('last_name'),
                email=params.get('email'),
                phone_number=params.get('phone_number'),
                birthday=params.get('birthday'),
                profile_image=params.get('profile_image')
            )
            user.password_hash = params.get('password')
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return make_response(user.to_dict(), 201)
        except Exception as e:
            return make_response({'error': 'something went wrong'}, 400)

api.add_resource(SignUp, '/signup')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

