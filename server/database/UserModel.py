from database import login_manager, db
from flask_login import UserMixin
from flask_wtf.file import FileField


@login_manager.user_loader
def load_user(user_id):
    return User.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(50), unique = True, nullable = False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    image_url = db.Column(db.String(20), nullable = False)
    online = db.Column(db.Boolean)
    socket_id = db.Column(db.String(50))
    room = db.Column(db.String(50))
    preferences = db.relationship('Preferences', backref  = "pref", lazy=True)

class Preferences(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(50), nullable = False)
    region = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))