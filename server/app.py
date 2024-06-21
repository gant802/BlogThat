#!/usr/bin/env python3

# Standard library imports

# Remote library imports
# from dotenv import load_dotenv
from flask import request, make_response, session, render_template
from flask_restful import Resource
from models import User, Post, Follow, Comment
from config import app, db, api, bcrypt

# load_dotenv()

# Local imports
from config import app, db, api
# Add your model imports

@app.route('/')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")

#returns list of all Users
class Users(Resource):
    def get(self):
        users = User.query.all()
        users_list = [user.to_dict() for user in users]
        return make_response(users_list, 200)

api.add_resource(Users, '/users')

class UsersById(Resource):
    #returns specific User
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return make_response({'error': 'User not found'}, 404)
    
    #edits specific User
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        try:
            params = request.json
            check_username = User.query.filter(User.username == params.get('username')).first()
            if check_username and check_username.id != id:
                return make_response({"error": "Username already exists"}, 401)
            for attr in params:
                setattr(user, attr, params[attr])
            db.session.add(user)
            db.session.commit()

            user_dict = user.to_dict()
            return make_response(user_dict, 202)
        
        except ValueError as v_error:
            return make_response({'errors': str(v_error)}, 400)

    #deletes a user  
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            response = {"error": "User not found"}
            return make_response(response, 404)
        db.session.delete(user)
        db.session.commit()

        return '', 204

api.add_resource(UsersById, '/users/<int:id>')

class Posts(Resource):
    #returns all posts
    def get(self):
       posts = [post.to_dict() for post in Post.query.all()]
       return make_response(posts, 200)

    #creates a new post
    def post(self):
        try:
            params = request.json
            new_post = Post(
                content = params.get('content'),
                user_id = session['user_id'])
            db.session.add(new_post)
            db.session.commit()
            return make_response(new_post.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'errors': [str(v_error)]}, 400)

api.add_resource(Posts, '/posts')


class PostById(Resource):
    #returns a specific post
    def get(self, id):
        post = Post.query.filter(Post.id == id).first()
        if not post:
            return make_response({"error": "Post not found"}, 404)
        return make_response(post.to_dict(), 200)
    
    #edits a post
    def patch(self, id):
        post = Post.query.filter(Post.id == id).first()
        if not post:
            return make_response({"error": "Post not found"}, 404)
        
        try:
            params = request.json
            for attr in params:
                setattr(post, attr, params[attr])
            db.session.add(post)
            db.session.commit()

            post_dict = post.to_dict()
            return make_response(post_dict, 202)
        
        except ValueError as v_error:
            return make_response({'errors': str(v_error)}, 400)

    #deletes a post    
    def delete(self, id):
        post = Post.query.filter(Post.id == id).first()
        if not post:
            response = {"error": "Post not found"}
            return make_response(response, 404)
        db.session.delete(post)
        db.session.commit()

        return '', 204

api.add_resource(PostById, '/posts/<int:id>')

class PostByUserId(Resource):
    #returns a post of a specific User
    def get(self, user_id):
        posts = Post.query.filter(Post.user_id == user_id).all()
        if not posts:
            return make_response({"error": "Posts not found"}, 404)
        return make_response([post.to_dict() for post in posts], 200)
    
api.add_resource(PostByUserId, '/posts/user/<int:user_id>')

class Following(Resource):
    #returns all users that the user is following
    def get(self):
        following = Follow.query.filter(Follow.follower_user_id == session['user_id']).all()
        following_row_list = [follow.to_dict(rules=('-follower','-following')) for follow in following]
        following_list = [User.query.get(following["following_user_id"]).to_dict() for following in following_row_list]
        return make_response(following_list, 200)
    
    #creates a new following relationship
    def post(self):
        try:
            params = request.json
            new_follow = Follow(
                following_user_id = params.get('user_id'),
                follower_user_id = session['user_id']
            )
            db.session.add(new_follow)
            db.session.commit()
            return make_response(new_follow.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'errors': [str(v_error)]}, 400)
    
        
api.add_resource(Following, '/following')

#returns list of who user is following
class FollowingById(Resource):
    def get(self, id):
        following = Follow.query.filter(Follow.follower_user_id == session['user_id']).all()
        following_row_list = [follow.to_dict(rules=('-follower','-following')) for follow in following]
        for user in following_row_list:
            if user['following_user_id'] == id:
                return make_response({"User is followed": "success"}, 200)
        if User.query.filter_by(id=id).first():
            return make_response({"User is not followed": "fail"}, 400)
        return make_response({"error": "User not found"}, 404)    

api.add_resource(FollowingById, '/following/<int:id>')

#deletes a following relationship
class Unfollow(Resource):
    def delete(self, id):
        follow = Follow.query.filter_by(following_user_id=id, follower_user_id=session['user_id']).first()
        
        if not follow:
            response = {"error": "User is not following or the relationship does not exist"}
            return make_response(response, 404)

        db.session.delete(follow)
        db.session.commit()
        
        return '', 204

api.add_resource(Unfollow, '/unfollow/<int:id>')      

#returns a list of who follows the user
class FollowersById(Resource):
    def get(self, id):
        followers = Follow.query.filter(Follow.following_user_id == id).all()
        followers_dict = [follower.to_dict(rules=('-follower','-following')) for follower in followers]
        followers_list = [User.query.get(follower['follower_user_id']).to_dict() for follower in  followers_dict]
        return make_response(followers_list, 200)
api.add_resource(FollowersById, '/followers/<int:id>')

#returns a list of posts of who the user is following
class FollowingPosts(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized: Must login'}, 401)
        
        user = User.query.get(user_id)
        if not user:
            return make_response({'error': 'User not found'}, 404)
        
        posts = user.feed
        posts_list = [post.to_dict() for post in posts]
        
        return make_response(posts_list, 200)

api.add_resource(FollowingPosts, '/following_posts')

#returns comments of a specific post   
class PostComments(Resource):
    def get(self, id):
        comments = Comment.query.filter(Comment.post_id == id).all()
        sorted_comments = sorted(comments, key=lambda comment: comment.created_at)
        comment_list = [comment.to_dict() for comment in sorted_comments]
        
        return make_response(comment_list, 200)
api.add_resource(PostComments, '/comments/post/<int:id>')

#returns comments of a specific User
class UserComments(Resource):
    def get(self, id):
        comments = Comment.query.filter(Comment.user_id == id).all()
        comment_list = [comment.to_dict() for comment in comments]

        return make_response(comment_list, 200)
api.add_resource(UserComments, '/comments/user/<int:id>')

#creates a comment on an existing post
class PostAComment(Resource):
    def post(self, post_id):
        try:
            params = request.json
            new_comment = Comment(
                comment = params.get('comment'),
                post_id = post_id,
                user_id = session['user_id']
            )
            db.session.add(new_comment)
            db.session.commit()
            return make_response(new_comment.to_dict(), 201)
        except ValueError as v_error:
            return make_response({'errors': [str(v_error)]}, 400)    
api.add_resource(PostAComment, '/comment/<int:post_id>')


class CommentById(Resource):
    #returns a specific comment
    def get(self, id):
        comment = Comment.query.filter(Comment.id == id).first()
        if not comment:
            return make_response({"error": "Comment not found"}, 404)
        return make_response(comment.to_dict(), 200)
    
    #edits a comment
    def patch(self, id):
        comment = Comment.query.filter(Comment.id == id).first()
        if not comment:
            return make_response({"error": "Comment not found"}, 404)
        
        try:
            params = request.json
            for attr in params:
                setattr(comment, attr, params[attr])
            db.session.add(comment)
            db.session.commit()
            comment_dict = comment.to_dict()
            return make_response(comment_dict, 202)
        
        except ValueError as v_error:
            return make_response({'errors': str(v_error)}, 400)
    
    #deletes a comment
    def delete(self,id):
        comment = Comment.query.filter(Comment.id == id).first()
        if not comment:
            response = {"error": "Comment not found"}
            return make_response(response, 404)
        db.session.delete(comment)
        db.session.commit()

        return '', 204

api.add_resource(CommentById, '/comments/<int:id>')

    
#checks to see if user is logged in
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = db.session.get(User, user_id)
            if user:
                return make_response(user.to_dict(), 200)
        return make_response({'error': 'Unauthorized: Must login'}, 401)

api.add_resource(CheckSession, '/check_session')

#creates a new_user. automatically follows User "BlogThat"
class SignUp(Resource):
    def post(self):
        params = request.json
        username=params.get('username')
        if User.query.filter_by(username=username).first():
            return make_response({"error": "Username already exists"}, 401)
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
            user_BlogThat = User.query.filter_by(username="BlogThat").first()
            follow_BlogThat = Follow(following_user_id = user_BlogThat.id,
                follower_user_id = user.id)
            db.session.add(follow_BlogThat)
            db.session.commit()
            session['user_id'] = user.id
            return make_response(user.to_dict(), 201)
        except Exception as e:
            return make_response({"error": str(e)}, 400)
        
api.add_resource(SignUp, '/signup')


#user login
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

#user logout
class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({}, 204)

api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

