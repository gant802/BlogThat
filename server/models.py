from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, func
from sqlalchemy.orm import validates

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ("-posts", "-following", "-followers")

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable = False)
    first_name = db.Column(db.String, nullable = False)
    last_name = db.Column(db.String, nullable = False)
    _password_hash = db.Column(db.String, nullable = False)
    email = db.Column(db.String, nullable = False)
    phone_number = db.Column(db.Integer, nullable = True)
    birthday = db.Column(db.String, nullable=True)
    profile_image = db.Column(db.String, nullable=True)

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # 6b. Create an authenticate method that uses bcyrpt to verify the password against the hash in the DB with bcrypt.check_password_hash

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan')
    following = db.relationship('Follow', foreign_keys='Follow.follower_user_id', back_populates='follower', cascade='all, delete-orphan')
    followers = db.relationship('Follow', foreign_keys='Follow.following_user_id', back_populates='following', cascade='all, delete-orphan')

    @property
    def following_posts(self):
        followed_users_ids = [follow.following_user_id for follow in self.following]
        posts = Post.query.filter(Post.user_id.in_(followed_users_ids)).all()
        return posts

    

    def __repr__(self):
        return f'<User id={self.id} username={self.username} >'


class Post(db.Model, SerializerMixin):
   __tablename__ = 'posts'

   serialize_rules = ("-user",)
  
   id = db.Column(db.Integer, primary_key=True)
   content = db.Column(db.String, nullable=False)
   created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
   user_id = db.Column(db.Integer, db.ForeignKey('users.id'))




   user = db.relationship('User', back_populates='posts')
  
   @property
   #call using Post.username
   def username(self):
       return self.user.username



class Follow(db.Model, SerializerMixin):
    __tablename__ = 'follows'

    serialize_rules = ("-following.followers","-follower.following")

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    #person being followed
    following_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    #person who is following
    follower_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    following = db.relationship('User', foreign_keys=[following_user_id], back_populates='followers')
    follower = db.relationship('User', foreign_keys=[follower_user_id], back_populates='following')

    

    #constraints for no repeats
    #constraints for following cant equal follower