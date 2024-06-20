from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, func
from sqlalchemy.orm import validates

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ("-posts", "-following", "-followers", "-comments.user")

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
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    following = db.relationship('Follow', foreign_keys='Follow.follower_user_id', back_populates='follower', cascade='all, delete-orphan')
    followers = db.relationship('Follow', foreign_keys='Follow.following_user_id', back_populates='following', cascade='all, delete-orphan')

    @property
    def feed(self):
        followed_users_ids = [follow.following_user_id for follow in self.following]
        posts = Post.query.filter(Post.user_id.in_(followed_users_ids)).all()
        user_posts = Post.query.filter(Post.user_id == self.id).all()
        posts.extend(user_posts)
        return posts
    
    @validates('email')
    def validate_email(self, key, address):
        if address is None:
            return address
        if '@' not in address:
            raise ValueError("Invalid email address")
        return address
    
    
    @validates('phone_number')
    def validate_phone_number(self, key, phone_number):
        if phone_number is None:
            return phone_number
        phone_number_str = str(phone_number)
        if len(phone_number_str) != 10 or not phone_number_str.isdigit():
            raise ValueError("Invalid phone number")
        return phone_number


    def __repr__(self):
        return f'<User id={self.id} username={self.username} >'


class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    serialize_rules = ("-comments.post",)
  
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)




    user = db.relationship('User', back_populates='posts')
    comments = db.relationship('Comment', back_populates='post', cascade='all, delete-orphan')
  
    @property
    #call using Post.username
    def username(self):
       return self.user.username

    @validates('content')
    def validate_content(self, key, content):
        if len(content) == 0:
            raise ValueError("Content cannot be empty")
        return content
    
    @validates('user_id')
    def validate_user_id(self, key, user_id):
        if user_id is None:
            raise ValueError("Post must contain user ID")
        return user_id



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

    @validates('following_user_id', 'follower_user_id')
    def validate_not_following_self(self, key, value):
        if key == 'following_user_id':
            following_user_id = value
            follower_user_id = self.follower_user_id
        else:
            follower_user_id = value
            following_user_id = self.following_user_id

        if following_user_id is not None and follower_user_id is not None:
            if following_user_id == follower_user_id:
                raise ValueError("User cannot follow themselves")
        

        follow_exists = db.session.query(Follow).filter_by(
                following_user_id=following_user_id,
                follower_user_id=follower_user_id
            ).first()
            
        if follow_exists:
            raise ValueError("This follow relationship already exists")
            

        return value
    
class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    serialize_rules = ("-post","-user.comments")

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    post = db.relationship("Post", back_populates="comments")
    user = db.relationship("User", back_populates="comments")


    @property
    def username(self):
       return self.user.username