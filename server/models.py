from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable = False)
    first_name = db.Column(db.String, nullable = False)
    last_name = db.Column(db.String, nullable = False)
    _password_hash = db.Column(db.String, nullable = False)
    email = db.Column(db.String, nullable = False)
    phone_number = db.Column(db.Integer, nullable = True)
    birthday = db.Column(db.Date, nullable=True)
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

    def __repr__(self):
        return f'<User id={self.id} username={self.username} >'
