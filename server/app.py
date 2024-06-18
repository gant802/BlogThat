#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from models import User, Post, Follow
from config import app, db, api, bcrypt

# Local imports
from config import app, db, api
# Add your model imports


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):

    def get(self):
        users = User.query.all()
        users_list = [user.to_dict() for user in users]
        return make_response(users_list, 200)

api.add_resource(Users, '/users')

class UsersById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return make_response({'error': 'User not found'}, 404)

api.add_resource(UsersById, '/users/<int:id>')

class Posts(Resource):
   def get(self):
       posts = [post.to_dict() for post in Post.query.all()]
       return make_response(posts, 200)
  
   def post(self):
       params = request.json
       new_post = Post(
           content = params.get('content'),
           user_id = session['user_id'])
       db.session.add(new_post)

  
api.add_resource(Posts, '/posts')


class PostById(Resource):

    def get(self, id):
        post = Post.query.filter(Post.id == id).first()
        if not post:
            return make_response({"error": "Post not found"}, 404)
        return make_response(post.to_dict(), 200)
    
    def patch(self, id):
        post = Post.query.filter(Post.id == id).first()
        if not post:
            return make_response({"error": "Post not found"}, 404)
        
        try:
            params = request.json
            for attr in params:
                setattr(post, attr, params[attr])
            db.session.commit()

            post_dict = post.to_dict()
            return make_response(post_dict, 202)
        
        except ValueError as v_error:
            return make_response({'errors': ["validation errors"]}, 400)
        
    def delete(self, id):
        post = Post.query.filter(Post.id == id).first()
        if not post:
            response = {"error": "Post not found"}
            return make_response(response, 404)
        db.session.delete(post)
        db.session.commit()

        return '', 204

api.add_resource(PostById, '/posts/<int:id>')

#checks for all people user is following
#take the folowing_user_id from object to get followers
class FollowingById(Resource):
    def get(self, id):
        following = Follow.query.filter(Follow.follower_user_id == id).all()
        following_list = [follow.to_dict(rules=('-follower','-following')) for follow in following]
        return make_response(following_list, 200)
api.add_resource(FollowingById, '/following/<int:id>')

#take the folower_user_id from object to get followers
class FollowersById(Resource):
    def get(self, id):
        following = Follow.query.filter(Follow.following_user_id == id).all()
        following_dict = [follow.to_dict(rules=('-follower','-following')) for follow in following]
        return make_response(following_dict, 200)
api.add_resource(FollowersById, '/followers/<int:id>')

# class FollowerPosts(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return make_response({'error': 'Unauthorized: Must login'}, 401)
        
#         user = User.query.get(user_id)
#         if not user:
#             return make_response({'error': 'User not found'}, 404)
        
#         posts = user.following_posts
#         posts_list = [post.to_dict() for post in posts]
        
#         return make_response(posts_list, 200)

# api.add_resource(FollowerPosts, '/follower_posts')

class FollowerPosts(Resource):
    def get(self, id):
        
        user = User.query.get(id)
        if not user:
            return make_response({'error': 'User not found'}, 404)
        
        posts = user.following_posts
        posts_dict = [post.to_dict() for post in posts]
        
        return make_response(posts_dict, 200)

api.add_resource(FollowerPosts, '/follower_posts')
    

    

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = db.session.get(User, user_id)
            if user:
                return make_response(user.to_dict(), 200)
        return make_response({'error': 'Unauthorized: Must login'}, 401)

api.add_resource(CheckSession, '/check_session')

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
            return make_response({"error": str(e)}, 400)
        
api.add_resource(SignUp, '/signup')


class Login(Resource):
    def post(self):
        params = request.json
        user = User.query.filter_by(username=params.get('username')).first()
        if not user:
            return make_response({'error': 'user not found'}, 404)

        if user.authenticate(params.get('password')):
            session['user_id'] = user.id
            return make_response(user.to_dict())
        else:
            return make_response({'error': 'invalid password' }, 401)

api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({}, 204)

api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

