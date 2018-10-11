# -*-coding=utf-8 -*-

import telegram
from config import config
from config import sql
from ForumService import Forum
from TagService import Tag
import random
from extract_variables import *
import numpy as np
from sklearn.externals import joblib


class Telegram(Forum):
    def __init__(self):
        Forum.__init__(self)
        self.bot = telegram.Bot(token=config.bot_token)
    
    def _bot_message(self, chat_id, username, question_id, title, content, answer_id=None, qa_coins=None, time_limit=None):
	if answer_id!=None:
	    self.bot.send_message(chat_id=chat_id, 
		text="""{} has a new post:
			\nquestion_id: {}
		        \nanswer_id: {}
		         \ncontent: {} 
		         \nPlease hold down this message to reply the answer
                         \nIf you want to see a series of posts for this answer, send /showall""".format(username, question_id, answer_id, content))
	elif qa_coins==None:
            self.bot.send_message(chat_id=chat_id, 
		text="""{} has a new post:
		        \nquestion_id: {} 
		         \ntitle: {} 
		         \ncontent: {} 
		         \nPlease hold down this message to reply the question""".format(username, question_id, title, content))
	else:
	    self.bot.send_message(chat_id=chat_id, 
		text="""{} has a new post:
		        \nquestion_id: {} 
		         \ntitle: {} 
		         \ncontent: {} 
			 \nQACoins: {}.
			 \ntimelimit: {}
		         \nPlease hold down this message to reply the question""".format(username, question_id, title, content, qa_coins, time_limit))

    def _bot_expert(self, chat_id, username, question_id, title, content):
        self.bot.send_message(chat_id=chat_id, 
	    text="""{} has a question:
		    \nquestion_id: {}
                    \ntitle: {} 
		    \ncontent: {} 
                    \nYou have been identified to be expert in this quesstion, please hold down this message to reply the answer""".format(username, question_id, title, content))


    def _bot_inactive(self, chat_id, username, question_id, title, content):
        self.bot.send_message(chat_id=chat_id, 
	    text="""{} has a question:
		    \nquestion_id: {}
                    \ntitle: {} 
		    \ncontent: {} 
                    \nYou have been inactive, please hold down this message to reply the answer""".format(username, question_id, title, content))

    def _process_tag_sim(self, sim, post_id):
        sim_strs = ["({}, {}, {})".format(i, post_id, j) for j, i in sim]
        return " ,".join(sim_strs)

    def _insert_tag_ass(self, post, post_id):
        tag_service = Tag(post)
        tag_service.newTag()
        self.cur.execute(sql.newTag_sql.format(
            self._process_tag_sim(tag_service.sim, post_id)
        ))
        self.con.commit()
    
    def newPost(self, post, thoughtfulness, previous_id='null'):
        self._init_con()
        chat_id = post['chat_id']
        qacoins = post['qacoin']
        subject = post['title']
        question = post['content']
        is_qa_bountiful = 1 if qacoins>0 else 0
        time_limit_qa = post['timelimit']
        time_limit_bot = self._date()+" "+self._time()
        self.cur.execute(sql.teleNewPost_sql.format(
            chat_id,
            self._process_string(subject),
            self._process_string(question), 
            0, 
            self._date()+" "+self._time(),
            is_qa_bountiful, 
            time_limit_qa, 
            time_limit_bot,
            self._qacoin(question, 1, chat_id),
            qacoins,
            thoughtfulness,
	    previous_id))
        self.con.commit()
        question_id = self.cur.lastrowid
        self._insert_tag_ass(post["content"], question_id)
	self._insert_thought_sim(question_id)
        self._close()
        return question_id

    def thought(self, question, q_a):
        self._init_con()
        thought = self._thoughtfulness_score(question, q_a)
        self._close()
        return thought

    def insert_abandoned_post(self, post, q_a, thought):
        self._init_con()
        subject = "" if q_a == 0 else post['title'] 
        insert_sql = sql.insertAbandonedPost_sql.format(subject, post['content'], thought)
        self.cur.execute(insert_sql)
        self.con.commit()
        post_id = self.cur.lastrowid
        self._close()
        return post_id   

    def tele_push_message(self, chat_id, question_id, title, content, answer_id, qa_coins=None, timelimit=None):
        self._init_con()
        self.cur.execute(sql.teleGetChatId.format(question_id,question_id))
        user_list = self.cur.fetchall()
        self._close()
	post_user_name = ''
        for user in user_list:
	    if str(user['chat_id']) == str(chat_id):
		post_user_name = user['avatar_name']
	for user in user_list:
	    try:
		self._bot_message(
		    user['chat_id'],
		    post_user_name,
		    question_id,
		    title,
		    content,
		    answer_id,
		    qa_coins,
		    timelimit 
		)
	    except:
		continue

    def bot_push_message(self, chat_id, question_id, title, content, answer_id, qa_coins=None, timelimit=None):
        self._init_con()
        self.cur.execute(sql.botGetChatId)
        user_list = self.cur.fetchall()
        self._close()
	post_user_name = ''
        for user in user_list:
	    if str(user['avatar_id']) == str(chat_id):
		post_user_name = user['avatar_name']
	for user in user_list:
	    try:
		self._bot_message(
		    user['chat_id'],
		    post_user_name,
		    question_id,
		    title,
		    content,
		    answer_id,
		    qa_coins,
		    timelimit 
		)
	    except:
		continue

    def tele_push_expert(self, avatar_id, question_id, title, content, expert):
        self._init_con()
        self.cur.execute(sql.teleGetAvatarId.format(avatar_id))
        user_list = self.cur.fetchall()
        self._close()
	post_user_name = ''
        for user in user_list:
	    if str(user['avatar_id']) == str(avatar_id):
		post_user_name = user['avatar_name']
	for user in user_list:
	    if str(user['chat_id']) in expert:
	        try:
		    self._bot_expert(
		        user['chat_id'],
		        post_user_name,
		        question_id,
		        title,
		        content
		    )
	        except:
		    continue

    def tele_push_inactive(self, avatar_id, question_id, title, content, inactive):
        self._init_con()
        self.cur.execute(sql.teleGetAvatarId.format(avatar_id))
        user_list = self.cur.fetchall()
        self._close()
	post_user_name = ''
        for user in user_list:
	    if str(user['avatar_id']) == str(avatar_id):
		post_user_name = user['avatar_name']
	for user in user_list:
	    if str(user['chat_id']) in inactive:
	        try:
		    self._bot_inactive(
		        user['chat_id'],
		        post_user_name,
		        question_id,
		        title,
		        content
		    )
	        except:
		    continue

    def web_push_message(self, userId, question_id, title, content,answer_id, qa_coins=None, timelimit=None):
        self._init_con()
        self.cur.execute(sql.webGetChatId.format(question_id,question_id))
        user_list = self.cur.fetchall()
        self._close()
	post_user_name = ''
        for user in user_list:
	    if int(user['avatar_id']) == int(userId):
		post_user_name = user['avatar_name']
	if int(userId)<=5:
	    post_user_name = "Question Bot"
        for user in user_list:
            try:
                self._bot_message(
                    user['chat_id'],
                    post_user_name,
                    question_id, 
                    title,
                    content,
		    answer_id,
		    qa_coins,
		    timelimit
                )
            except:
                continue

    def replyToPost(self, post, thought):
        self._init_con()
        self.cur.execute(sql.teleReplyToPost_insert_sql.format(
            post['chat_id'],
            post['answer'],
            2,
            0,
            self._date()+" "+self._time(),
            post['question_id'],
            self._qacoin(post['answer'], 0, post['chat_id']),
            thought,
            post['question_id']
        ))
	self.con.commit()
	post_id = self.cur.lastrowid
        self._insert_tag_ass(post["answer"], post_id)
	self._insert_thought_sim(post_id)
        self._close()
	return post_id

    def replyToReply(self, post, thought):
        self._init_con()
        self.cur.execute(sql.teleReplyToReply_insert_sql.format(
            post['chat_id'],
            post['answer'],
            post['question_id'],
            0,
            self._date()+" "+self._time(),
            post['question_id'],
            self._qacoin(post['answer'], 0, post['chat_id']),
            thought,
            post['question_id']
        ))
	self.con.commit()
	post_id = self.cur.lastrowid
        self._insert_tag_ass(post["answer"], post_id)
	self._insert_thought_sim(post_id)
        self._close()
	return post_id

    def Survey(self, user_data):
        self._init_con()
        self.cur.execute(sql.survey_sql.format(
            user_data['chat_id'],
            int(user_data['Q1'].split()[0]),
            int(user_data['Q2'].split()[0]),
            int(user_data['Q3'].split()[0]),
            int(user_data['Q4'].split()[0]),
            int(user_data['Q5'].split()[0]),
            int(user_data['Q6'].split()[0]),
            user_data['Q7'],
            user_data['Q8']
        ))
        self.con.commit()
	self._close()

    def Survey_chat(self):
        self._init_con()
        self.cur.execute(sql.survey_chat_sql)
        values = self.cur.fetchall()
	self._close()
        a=[]
        for v in values:
	    a.append(v['chat_id'])
        return a
    
    def _get_question_id(self, post_id):
	self.cur.execute(
		"select if(question_id=0, {}, question_id)as q_id from post where post_id={}".format(post_id, post_id)
) 
	question_id = self.cur.fetchall()[0]['q_id']
	return question_id

    def reply2Reply(self, post):
        self._init_con()
        self.cur.execute(sql.teleReply2Reply_insert_sql.format(
            post['chat_id'],
            post['answer'],
            post['question_id'],
            0,
            self._date()+" "+self._time(),
            post['question_id'],
	    post['question_id'],
            self._qacoin(post['answer'], 0, post['chat_id']),
            self._thoughtfulness_score(post['answer'], 0),
	    post['question_id']
        ))
	self.con.commit()
	post_id = self.cur.lastrowid
	print post_id
        self._insert_tag_ass(post["answer"], post_id)
	self._insert_thought_sim(post_id)
	question_id = self._get_question_id(post['question_id'])
        self._close()
	return question_id, post_id

    def allPost(self, answerid):
        self._init_con()
        posts = []
        answer_id = answerid
	while answer_id != 0:
	    self.cur.execute(sql.allPost.format(answer_id))
            post_list = self.cur.fetchall()
	    for post in post_list:
	        if int(post['post_id']) == int(answer_id):
		    posts.append(str(post['post_content']))
                    answer_id = post['parent_id']
        self.con.commit()
        return posts

    def allPostID(self, answerid):
        self._init_con()
        postsID = []
        answer_id = answerid
	while answer_id != 0:
	    self.cur.execute(sql.allPost.format(answer_id))
            post_list = self.cur.fetchall()
	    for post in post_list:
	        if int(post['post_id']) == int(answer_id):
		    postsID.append(str(post['post_id']))
                    answer_id = post['parent_id']
        self.con.commit()
        return postsID

    def _process_string(self, string):
        return string.replace("'", "\\'")

    def upsert_chat_id(self, chat_id, username):
        self._init_con()
        self.cur.execute(sql.upsertChatId_sql.format(chat_id, self._process_string(username)))
        self.con.commit()
        self._close()
            
    def verify_telgram(self, username):
        self._init_con()
        self.cur.execute("select * from avatar where telegram_account='{}'".format(self._process_string(username)))
        user = self.cur.fetchall()
        self._close()
        return len(user)>0

    def get_user_qacoins(self, chat_id):
        self._init_con()
        self.cur.execute(sql.teleGetStat_sql.format(chat_id))
        qacoin = self.cur.fetchall()
        self._close()
	if len(qacoin) == 0:
	    return 0
        return qacoin[0]['qacoins']

    def _get_ranking_percentile(self, chat_id):
        self.cur.execute(sql.teleGetStat_sql.format(chat_id))
        users = list(self.cur.fetchall())
        ranking = 1
        for user in users:
	    if str(user['chat_id']) == str(chat_id):
		return np.power(2, ranking/float(len(users)))
            ranking += 1
	return 2
    
    def _thoughtfulness_score(self, content, q_a):
        self.v1 = average_number_of_characters_per_word(content)
        self.v2 = average_number_of_words_per_sentence(content)
        self.v3 = number_of_words(content)
        self.v4 = discourse_relations_score(content)
        self.v5 = formula_count(content)
        self.v6 = average_noun_phrases_per_sentence(content)
        self.v7 = average_verb_phrases_per_sentence(content)
        self.v8 = average_pronouns_phrases_per_sentence(content)
        self.v9 = number_of_links(content)
        self.v10 = type_of_question(content)
        self.v11 = 1
        v12 = q_a
        X = np.column_stack([self.v1,self.v2,self.v3,self.v4,self.v5,self.v6,self.v7,self.v8,self.v9,self.v10,self.v11,v12])
        filename = "/home/jeanc/rfr_model.sav"
        rfr = joblib.load(filename)
        mark = rfr.predict(X)[0]
        return round(mark,2)
            
    def _qacoin(self, content, q_a, avatar_id):
        qaf = self._get_ranking_percentile(avatar_id)
        score = self._thoughtfulness_score(content, q_a)
        qa_coin = qaf * score
        return int(qa_coin+0.5)

    def _insert_thought_sim(self, post_id):
	self.cur.execute(sql.newUserThought_insert_sql.format(post_id, self.v1,self.v2,self.v3,self.v4,self.v5,self.v6,self.v7,self.v8,self.v9,self.v10,self.v11))
        self.con.commit()

    def QAhistory(self, chat_id):
	qacoin = 0
        self._init_con()
        self.cur.execute(sql.qabasic_sql.format(
            chat_id
        ))
        qabasic = self.cur.fetchall()
        self._close()
	text = 'Basic QA coins:\n'
        for qa in qabasic:
	    qacoin += qa['qa_coin_basic']
	    text=text+'post id:'+str(qa['post_id'])+'\n'+'QA coin:+'+str(round(qa['qa_coin_basic'],2))+'\n'+str(qa['timestamp'])+'\n\n'
	self._init_con()
        self.cur.execute(sql.qagive_sql.format(
            chat_id
        ))
        qagive = self.cur.fetchall()
        self._close()
	if len(qagive)>0:
	    text = text + '\n\nQA coins given out:\n'
	    for qa in qagive:
	        qacoin -= qa['qa_coin']
	        text=text+'post id:'+str(qa['post_id'])+'\n'+'QA coin:-'+str(round(qa['qa_coin'],2))+'\n'+str(qa['timestamp'])+'\n\n'
	self._init_con()
        self.cur.execute(sql.qaearn_sql.format(
            chat_id
        ))
        qaearn = self.cur.fetchall()
        self._close()
	if len(qaearn)>0:
	    text = text + '\n\nQA coins earned (best answer for those questions with qa coin bounty):\n'
	    for qa in qaearn:
	        qacoin += qa['qa_coin']
	        text=text+'post id:'+str(qa['post_id'])+'\n'+'QA coin:+'+str(round(qa['qa_coin'],2))+'\n'+str(qa['timestamp'])+'\n\n'
	self._init_con()
        self.cur.execute(sql.qaloss_sql.format(
            chat_id
        ))
        qaloss = self.cur.fetchall()
        self._close()
	if len(qaloss)>0:
	    text = text + '\n\nQA coins withheld:\n'
	    for qa in qaloss:
	        qacoin -= qa['qa_coin_bounty']
	        text=text+'post id:'+str(qa['post_id'])+'\n'+'QA coin:-'+str(round(qa['qa_coin_bounty'],2))+'\n\n'
	self._init_con()
        self.cur.execute(sql.qaimprove_sql.format(
            chat_id
        ))
        qaimprove = self.cur.fetchall()
        self._close()
	text = 'QA coin spent for need improvement:\n'
        for qa in qaimprove:
	    qacoin -= 1
	    text=text+'post id:'+str(qa['post_id'])+'\n'+'QA coin:-1\n'+str(qa['timestamp'])+'\n\n'
	text = text + '\n\nTotal QA coins:' + str(round(qacoin,2))
        self.bot.send_message(chat_id=chat_id, text=text)


    def Thistory(self, chat_id):
	score = 0
        self._init_con()
        self.cur.execute(sql.thought_sql.format(
            chat_id
        ))
        thought = self.cur.fetchall()
        self._close()
	text = 'Thoughtfulness score:\n'
        for t in thought:
	    score += t['thoughtfulness_score']
	    text=text+'post id:'+str(t['post_id'])+'\n'+'Thoughtfulness score:+'+str(round(t['thoughtfulness_score'],2))+'\n'+str(t['timestamp'])+'\n\n'
	text = text + '\n\nTotal Thoughtfulness Score:' + str(round(score,2))
        self.bot.send_message(chat_id=chat_id, text=text)
