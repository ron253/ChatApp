from flask import Flask, make_response, request,sessions
from datetime import timedelta
from flask_socketio import SocketIO
from flask_socketio import join_room, leave_room, send
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from pathlib import Path
from flask_cors import CORS
import json
from flask_session import Session 
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
import os

app = Flask(__name__)
load_dotenv()
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_KEY = os.getenv("JWT_SECRET")

CORS(app, resources={r"/*": {"origins": "*"}})

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.config['SECRET_KEY'] = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JWT_TOKEN_LOCATION'] = ['cookies', 'headers']
app.config['JWT_SECRET_KEY'] = JWT_KEY
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['UPLOAD_FOLDER'] = r"C:\Users\matth\Personal_Projects\social-media-app\public\images\userUploads"
app.host = 'localhost'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

bcrypt = Bcrypt(app)
socketio = SocketIO(app, cors_allowed_origins = "*")

db = SQLAlchemy(app)
migrate=Migrate(app,db) #Initializing migrate.
manager = Manager(app)
manager.add_command('db',MigrateCommand)

login_manager = LoginManager()
login_manager.init_app(app)

jwt = JWTManager(app)

from database import routes

