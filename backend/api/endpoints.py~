from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required,\
    create_access_token, get_jwt_identity
import random
import pickle
import time
from services.PostService import Post 
import json
import datetime

post = Post()

app = Flask(__name__)
app.secret_key = "JWT SECRET"
app.config['JWT_EXPIRATION_DELTA'] = datetime.timedelta(seconds=3600)
app.config['JWT_REFRESH_EXPIRATION_DELTA'] = datetime.timedelta(seconds=3600)
jwt = JWTManager(app)

def gen_tags():
    tags=[]
    for i in range(random.randint(1, 6)):
        tags.append({
            "key": i, 
            "label": 'tag{}'.format(i)
        })
    return tags

def process_string(string):
    return string.replace("'", "\\'")

@app.route("/login", methods=["POST"])
def login():
    email = request.json.get('email')
    username = email.split("@")[0]
    user_info = post.get_user_login(username)
    is_teacher = False
    if len(user_info) > 0:
        token = create_access_token(username)
        try:
            int(username[-4:])
        except:
            is_teacher = True
        return jsonify(access_token=token,
                         msg="Success", 
                         is_teacher=is_teacher, 
                         userId=user_info[0]['avatar_id'],
                         section_id=user_info[0]['section_id'],
                         email=user_info[0]['email'],
                         username=user_info[0]['avatar_name'],
                         agreed=True if user_info[0]['agreed']=="1" else False ), 200

    return jsonify(access_token="", msg="Bad username or password"), 401

@app.route('/stat', methods=['POST'])
@jwt_required
def get_user_stat():
    user_id = request.json.get('userId')
    data = post.get_user_stat(user_id)
    return jsonify(data)

@app.route('/posts', methods=['POST'])
@jwt_required
def get_posts():
    filter = request.json.get('filter')
    return jsonify(post.getPosts(filter))

@app.route('/question', methods=['POST'])
@jwt_required
def get_question():
    key = request.json.get('questionId')
    user_id = request.json.get('userId')
    data = post.get_post(user_id, key)
    data['question']['isUser'] = (data['question']['userId']==user_id)
    return jsonify(data)

@app.route('/get_tags', methods=['POST'])
@jwt_required
def get_tags():
    post_id = request.json.get('post_id')
    return jsonify(post.get_all_tags(post_id))

@app.route('/setpost', methods=['POST'])
@jwt_required
def set_post():
    post_detail = request.json.get('post')
    post_detail['subject'] = process_string(post_detail['subject'])
    post_detail['question'] = process_string(post_detail['question'])
    if not post_detail['edit']:
        post.delete_abandoned_post(post_detail['previous_post_id'])
        post_detail['previous_post_id'] = "null"
    post.newPost(post_detail)
    return jsonify(post.getPosts({'userId': post_detail['userId']}))

@app.route("/setanswer", methods=['POST'])
@jwt_required
def set_answer():
    answer = request.json.get("answer")
    answer['answer'] = process_string(answer['answer'])
    if not answer['edit']:
        post.delete_abandoned_post(answer['previous_post_id'])
        answer['previous_post_id'] = "null"
    post.replyToPost(answer)
    data = post.get_post(answer['userId'], answer['questionId'])
    data['question']['isUser'] = (data['question']['userId']==answer['userId'])
    return jsonify(data)

@app.route("/setthoughtfulness", methods=['POST'])
@jwt_required
def set_thoughtfulness():
    t_post = request.json.get("post")
    post.insert_training_data(t_post)
    data = post.get_post(t_post['userId'], t_post['questionId'])
    data['question']['isUser'] = (data['question']['userId']==t_post['userId'])
    return jsonify(data)

@app.route("/rank", methods=['POST'])
@jwt_required
def get_vehicle_ranks():
    data = ocbc_service.get_rank()

    return jsonify(data)

@app.route("/addtag", methods=['POST'])
@jwt_required
def add_tag():
    t_post = request.json.get("post")
    post.add_tag(t_post)
    data = post.get_post(t_post['userId'], t_post['questionId'])
    data['question']['isUser'] = (data['question']['userId']==t_post['userId'])
    return jsonify(data)

@app.route("/deletetag", methods=['POST'])
@jwt_required
def delete_tag():
    t_post = request.json.get("post")
    post.delete_tag(t_post)
    data = post.get_post(t_post['userId'], t_post['questionId'])
    data['question']['isUser'] = (data['question']['userId']==t_post['userId'])
    return jsonify(data)

@app.route("/getthoughtfulness", methods=['POST'])
@jwt_required
def get_thoughtfulness():
    t_post = request.json.get("post")
    if t_post['subject'] != None:
        t_post['subject'] = process_string(t_post['subject'])
    t_post['content'] = process_string(t_post['content'])
    data = post.insert_abandoned_post(t_post)   
    return jsonify(data)

@app.route("/setusername", methods=['POST'])
@jwt_required
def set_username():
    user = request.json.get("user")
    post.set_user_name(user)
    user_info = post.get_user_by_id(user['userId'])
    is_teacher = False
    try:
        int(user_info['email'][-4:])
    except:
        is_teacher = True
    return jsonify( msg="Success", 
                    is_teacher=is_teacher, 
                    userId=user_info['avatar_id'],
                    section_id=user_info['section_id'],
                    email=user_info['email'],
                    username=user_info['avatar_name'],
                    agreed=True if user_info['agreed']=="1" else False)
    
@app.route("/get_topics", methods=['POST'])
@jwt_required
def get_topics():
    return jsonify(post.get_topics())

@app.route("/vote", methods=['POST'])
@jwt_required
def set_vote():
    vote = request.json.get("vote")
    post.set_vote(vote['post_id'], vote['avatar_id'], vote['vote'])
    data = post.get_post(vote['avatar_id'], vote['questionId'])
    data['question']['isUser'] = (data['question']['userId']==vote['avatar_id'])
    return jsonify(data)

@app.route("/get_sessions", methods=['POST'])
@jwt_required
def get_sessions():
    avatar_id = request.json.get("avatar_id")
    return jsonify(post.get_sessions(avatar_id))

@app.route("/getnewts", methods=['POST'])
@jwt_required
def get_newts():
    t_post = request.json.get("post")
    if t_post['subject'] != None:
        t_post['subject'] = process_string(t_post['subject'])
    t_post['content'] = process_string(t_post['content'])
    data = post.get_new_thoughtfulness(t_post)   
    return jsonify(data)
