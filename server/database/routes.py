
# from werkzeug import secure_filename
from database.helper import deleteFoundUser
from database.UserModel import User, Preferences
from database import app, db, ALLOWED_EXTENSIONS,bcrypt, sessions, socketio

from flask import request, make_response, jsonify, redirect,session
from flask_login import login_user, logout_user
import json
from werkzeug.utils import secure_filename
import os
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import unset_jwt_cookies
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from flask_socketio import emit,send, join_room
from database import helper


q = []
existing_sids = []

@app.before_first_request
def create_tables():
    db.create_all()


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
        return jsonify({"access_token": access_token})
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/register", methods= ['POST', 'GET'])
def registerForm():
    if request.method == 'POST':
        userName = request.form["userName"]
        email = request.form["Email"]
        password = request.form["password"]
        confirmPassword = request.form["confirmPassword"]
        duplicateEmail =  User.query.filter_by(email=email).first()
        duplicateUser = User.query.filter_by(userName = userName).first()
        file = request.files["file"]
        if 'file' not in request.files:
            return json.dumps({"fileError": "No file part"})

        if not file  and not allowed_file(file.filename):
            return json.dumps({"fileError": "Only png, jpg, jpeg extensions are allowed" })
            

        if password != confirmPassword:
            return json.dumps({"passwordError": "Passwords Do Not Match! "}), 403

        if  duplicateEmail is not None:
            return json.dumps({"duplicateEmailError": "E-mail Already Exists! Please sign in."}), 409

        if duplicateUser is not None:
            return json.dumps({"duplicateUserNameEror": "Username Already Exists! Please choose a different one."}), 409

        filename = secure_filename(file.filename)
        print("File name is " + filename, flush = True)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(userName = userName, email = email, password = pw_hash, image_url = filename, online = False )
     
        db.session.add(user)
        db.session.commit()

       
        
        return json.dumps({"success": "registered"}), 200
    
  


    


@app.route("/login", methods = ['POST', 'GET'])
def login():
    if request.method == 'POST':
        userName = request.form["userName"]
        password = request.form['password']
        getUserName = User.query.filter_by(userName=userName).first()
       
        if getUserName != None:
            hash_pass = getUserName.password
        if getUserName and bcrypt.check_password_hash(hash_pass, password):
            login_user(getUserName)
            access_token = create_access_token(identity=userName)
            refresh_token = create_refresh_token(identity=userName)
            return jsonify({"access_token":access_token, "refresh_token":refresh_token}),200

       
        
        return json.dumps({"errorMessage":"E-mail Does Not Exist or Password Is Incorrect"}), 404
   




# @app.route("/logout",methods = ['GET', 'POST'] )
# def logout():
#     if request.method == 'GET':
#         logout_user()
        

#         return json.dumps({'logout': True}), 200

@app.route("/user/profile/<details>", methods = ['GET'])
def userImage(details):
    if request.method == 'GET':
        
        if 'sub' in request.headers:
            user = request.headers['sub']
            queryUser = User.query.filter_by(userName=user).first()
        if details == 'chatImage':
            matchingUser = request.headers['matchingUser']
            queryMatchingUser = User.query.filter_by(userName=matchingUser).first()
            imageUrl = queryUser.image_url
            matchingUserUrl = queryMatchingUser.image_url
            return json.dumps({"imageUrl": "../images/userUploads/" + imageUrl, 
            "matchingUserImage":"../images/userUploads/" + matchingUserUrl, "error":False})

        elif details == 'accountImage':
            accountImageUrl = queryUser.image_url
            return json.dumps({"imageFile":"../images/userUploads/" + accountImageUrl, "error":False})

        elif details == 'username':
            userName = queryUser.userName
            return json.dumps({"userName": userName, "error":False})
       
        return json.dumps({"error":True, "errorMsg":"Could not retrieve user profile"})

    


@app.route("/user/info",  methods = ['POST', 'GET'])
def userInfo():

    if request.method == 'POST':

        password = request.form["password"]
        confirmPassword = request.form["confirmPassword"]
        file = request.files["file"]
        sub = request.headers['sub']
        user =  User.query.filter_by(userName = sub).first()
    
        
        if password != confirmPassword or not bcrypt.check_password_hash(user.password, password):
            return json.dumps({"error":True, "errorMsg": "Invalid password. Please try again. "}), 403
    
        if not file  and not allowed_file(file.filename):
            return json.dumps({"error":True, "errorMsg": "Only png, jpg, jpeg extensions are allowed" })
        else:
            if user.image_url != None:
                path  = os.path.join(app.config['UPLOAD_FOLDER'], user.image_url)
            if os.path.isfile(path):
                os.remove(path)
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            user.image_url = filename
            db.session.commit()

        
        return json.dumps({"error":False, "success":"Profile has been successfully updated!"})

@socketio.on('matchUser')
def handle_message(data):
    country = data['country']
    region = data['region']
    currentUser = data['username']

    if existing_sids != [] and q != [] and currentUser in existing_sids:
        updateCurrentUser = list(filter(lambda person: person['username'] == currentUser, q))
        updateCurrentUser[0]['country'] = country
        updateCurrentUser[0]['region'] = region
    if currentUser not in existing_sids:
        existing_sids.append(currentUser)
        q.append({
        "username":currentUser,
        "country":country,
        "region":region,
        "sid":request.sid
        })

    if q !=  []:
        matchingUser = list(filter(lambda person:person['country'] == country and person['region'] == region and person['username'] != currentUser, q))

        if (matchingUser != []):
            emit("join", json.dumps({"users":[  
            {"matchingUser":matchingUser[0]['username'], "sid":matchingUser[0]['sid']}  , 

            {"currentUser":currentUser, "sid":request.sid}   

            ]}), broadcast = True)
            deleteFoundUser(matchingUser[0]['username'], q)

            if matchingUser[0]['username'] in existing_sids:
                existing_sids.remove(matchingUser[0]["username"])
            if currentUser in existing_sids:
                existing_sids.remove(currentUser)
                deleteFoundUser(currentUser, q)
  
    
@socketio.on("joinRoom")
def chatRoom(data):
  
    _room = data['room']
    recipient = data['recipient']
    sender = data['sender']
    matchingUserRoom = data['matchingUserRoom']
    join_room(_room)
    emit("userJoins", {"msg": f'{sender} has joined the room', "recipient":recipient}, broadcast=True)


@socketio.on("message")
def sendMessages(data):
   
    msg = data['msg']
    recipient = data['recipient']
    sender = data['sender']
    _room= data['room']
    matchingUserRoom = data['matchingUserRoom']
    emit("msg", {"msg":msg, "recipient":recipient}, room= matchingUserRoom)





@socketio.on("typing")
def userTyping(data):
  
    isTyping = data['isTyping']
    recipient = data['recipient']
    sender = data["sender"]
    room = data['room']
    matchingUserRoom = data['matchingUserRoom']
    
    emit("isTyping",  {"isTyping":isTyping, "recipient":recipient, "sender":sender}, room= matchingUserRoom)

@socketio.on('disconnect')
def disconnect():
    
    logout_user()
    emit('user-disconnected', {"requestSid":request.sid}, broadcast=True)