from datetime import *
import time
from config import config
from config import sql
from ForumService import Forum
from TagService import Tag
from TelegramService import Telegram
import random
import subprocess
from extract_variables import *
import numpy as np
from sklearn.externals import joblib
import multiprocessing as mp

telegram = Telegram()

class Post(Forum):
    def __init__(self):
        Forum.__init__(self)

    def _pagination(self, post_list):
        pagination_list = []
        while len(post_list)>10:
            pagination_list.append(post_list[:10])
            del post_list[:10]
        pagination_list.append(post_list)
        return pagination_list

    def newPost(self, post, thoughtfulness=None):
        self._init_con()
        user_id = post['userId']
        qacoins = post['qacoins']
        subject = post['subject']
        question = post['question']
        section_id = post['section_id']
        is_qa_bountiful = 1 if qacoins>0 else 0
        time_limit_qa = post['dateTime']
        time_limit_bot = self._date()+" "+self._time()
        self.cur.execute(sql.newPost_sql.format(
            user_id,
            subject,
            question,
            0,
            self._date()+" "+self._time(),
            is_qa_bountiful,
            time_limit_qa,
            time_limit_bot,
            self._qacoin(question, 1, user_id),
            qacoins,
            self._thoughtfulness_score(question, 1),
            post['previous_post_id'],
            section_id))
        self.con.commit()
        post_id = self.cur.lastrowid
        self._insert_tag_ass(post["question"], post_id)
        self._insert_thought_sim(post_id)
        tags = self._get_tags(post_id)
        self._close()
        p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -t '{}' -c '{}' -w web -o '{}' -l '{}'".format(
                user_id, post_id, subject.replace("\\'", "\'\"\'\"\'"), question.replace("\\'", "\'\"\'\"\'"), qacoins, time_limit_qa)
            ], shell=True)
        return post_id


    def replyToPost(self, post):
        self._init_con()
        self.cur.execute(sql.replyToPost_insert_sql.format(
            post['userId'],
            post['answer'],
            post['level'],
            0,
            self._date()+" "+self._time(),
            post['questionId'],
            self._qacoin(post['answer'], 0, post['userId']),
            self._thoughtfulness_score(post['answer'], 0),
            post['parentId'],
            post['previous_post_id']
        ))
        self.con.commit()
        post_id = self.cur.lastrowid
        self._insert_tag_ass(post["answer"], post_id)
        self._insert_thought_sim(post_id)
        self._close()
	p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -a '{}' -t '{}' -c '{}' -w web".format(
                post['userId'], post['questionId'], post_id, "no title", post['answer'].replace("\\'", "\'\"\'\"\'"))
            ], shell=True)

    def getPosts(self, filter):
        self._init_con()
        if 'topic_id' in filter and filter['topic_id'] !=0 :
            self.cur.execute(sql.getPostsByTopicSection_sql.format(filter['topic_id'], config.tag_association, filter['section_id']))
        else:
            self.cur.execute(sql.getPosts_sql.format(filter["section_id"]))
        values = self.cur.fetchall()
        for value in values:
            value['date'] = value['date'].strftime(config.date_format)
        self._close()
        return self._pagination(list(values))

    def getPostsByTopic(self, page, topicSelect):
        cursor = self.cur.execute(sql.getPostsByTopic_sql, topicSelect)
        values = cursor.fetchall()
        l, tmp = len(values), []
        if (page-1)*10 > l: 
            page = int(l/10)+1
        elif page < 1: 
            page = 1
        for i in range(l): 
            tmp.append([values[i+10*(page-1)][0], values[i+10*(page-1)][1]])
        return tmp

    def unreadPosts(self):
        cursor_parent = self.cur.execute(sql.unreadPosts_parentid_sql, self.userid)
        parents = cursor_parent.fetchall()
        cursor = self.cur.execute(sql.unreadPosts_sql, ','.join(str(p) for p in parents))
        values = cursor.fetchall()
        l, tmp = len(values), []
        for i in range(l): 
            tmp.append(values[i][0])
        count = len(tmp)
        return tmp, count

    def Posts(self, questionid):
        cursor = self.cur.execute(sql.Posts_sql, questionid)
        results = []
        for row in cursor.fetchall():
            results.append(dict(zip(row.keys(), row)))
        return results
    
    def updateThought(self, postid):
        cursor = self.cur.execute(sql.updateThought_select_sql, postid)
        value = cursor.fetchone()
        self.cur.execute(sql.updateThought_update_sql, (value[0],postid))
    
    def updateQA(self, postid):
        cursor_score = self.cur.execute(sql.updateQA_score_sql, postid)
        value_score = cursor_score.fetchone()
        cursor_QAF = self.cur.execute(sql.updateQA_QAF_sql, postid)
        value_QAF = cursor_QAF.fetchone()
        self.cur.execute(sql.updateQA_update_sql,(value_score[0]*value_QAF[0],postid))   

    def _get_tags(self, post_id):
        cursor = self.cur.execute(sql.getTags_sql.format(post_id, config.tag_association))
        return list(self.cur.fetchall())

    def _get_answers(self, avatar_id, post_id):
        cursor = self.cur.execute(sql.getAnswer_sql.format(avatar_id, post_id))
        return self._process_answers(list(self.cur.fetchall()))

    def _process_answers(self, answers):
        for answer in answers:
            answer["reviewed"] = True if answer["reviewed"]=="1" else False
        processed_answers = {}
        answers_left = {}
        appended_answers = {}
        for answer in answers:
            if answer['level'] == 2:
                answer['date'] = answer['date'].strftime(config.date_format)
                answer['subAnswer'] = []
                processed_answers[int(answer['answerId'])] = answer
            else:
                if int(answer['level']) in answers_left.keys():
                    answers_left[int(answer['level'])].append(answer)
                else:
                    answers_left[int(answer['level'])] = [answer]
        level_list = answers_left.keys()
        level_list.sort()
        for level in level_list:
            for answer in answers_left[level]:
                answer['aUserName'] = answer['username']
                answer['postDate'] = answer['date'].strftime(config.date_format)
                answer['content'] = answer['answer']
                if level == 3:
                    processed_answers[int(answer['parent_id'])]['subAnswer'].append(answer)
                    if int(answer['parent_id']) in appended_answers.keys():
                        appended_answers[int(answer['parent_id'])].append(int(answer['answerId']))
                    else:
                        appended_answers[int(answer['parent_id'])] = [int(answer['answerId'])]
                else:
                    for key in appended_answers:
                        if answer['parent_id'] in appended_answers[key]:
                            sorted_subanswer = []
                            for i in processed_answers[key]['subAnswer']:
                                sorted_subanswer.append(i)
                                if i['answerId'] == answer['parent_id']:
                                    sorted_subanswer.append(answer)
                            processed_answers[key]['subAnswer'][:] = sorted_subanswer
                            appended_answers[key].append(int(answer['answerId']))
        return processed_answers.values()

    def _get_question(self, avatar_id, post_id):
        cursor = self.cur.execute(sql.getPost_sql.format(avatar_id, post_id))
        return self.cur.fetchall()[0]

    def get_post(self, avatar_id, post_id):
        result = {}
        self._init_con()
        question = self._get_question(avatar_id, post_id)
        question["reviewed"] = True if question["reviewed"]=="1" else False
        question['tags'] = self._get_tags(post_id)
        answers = self._get_answers(avatar_id, post_id)
        self._close()
        result['question'] = question
        result['answers'] = answers
        return result

    def get_all_tags(self, post_id):
        self._init_con()
        cursor = self.cur.execute(sql.getAllTags_sql.format(config.tag_association,post_id))
        tags = list(self.cur.fetchall())
        self._close()
        return tags

    def _update_tags(self, association, post_tags):
        try:
            self._init_con()
            self.cur.execute(
                sql.updatePostTag_sql.format(
                    association, post_tags['post_id'], post_tags['tag_id']))
            self.con.commit()
            self._close()
            return True
        except:
            return False
    
    def add_tag(self, post_tags):
        return self._update_tags(config.show_tag_association, post_tags)
    
    def delete_tag(self, post_tags):
        return self._update_tags(config.hide_tag_association, post_tags)

    def _process_tag_sim(self,post_id):
        self.cur.execute(sql.getALLTagIds_sql)
        sim = self.cur.fetchall()
        sim_strs = ["({}, {}, {})".format(i["tag_id"], post_id, 0) for i in sim]
        return " ,".join(sim_strs)
        
    def _insert_tag_ass(self, post, post_id):
        tag_service = Tag(post)
        tag_service.newTag()
        self.cur.execute(sql.newTag_sql.format(
            self._process_tag_sim(post_id)
        ))
        self.con.commit()

    def _get_all_user_stat(self, section_id):
        self._init_con()
        self.cur.execute(sql.getStat_sql.format(section_id))
        users = list(self.cur.fetchall())
        self._close()
        ranking = 1
        for user in users:
            user['ranking'] = ranking
            ranking += 1
        return users
        
    def get_user_stat(self, avatar_id, section_id):
        users = self._get_all_user_stat(section_id)
        user_stat = {}
        ranking = []
        count = 0
        ranking_keys = ['username', 'ranking', 'thoughfulness']
        for user in users:
            if count < 10:
                ranking.append({i: user[i] for i in ranking_keys})
            if int(avatar_id) == int(user['avatar_id']):
		user['qacoins'] = round((0 if user['qacoins']==None else user['qacoins']), 1)
		user['thoughfulness'] = round((0 if user['thoughfulness']==None else user['thoughfulness']), 1)
                user_stat = user
	if len(user_stat) == 0:
	    user_info = self.get_user_by_id(avatar_id)
	    user_stat = {"qacoins": "0", "section_id": user_info["section_id"], "username": user_info["avatar_name"], "thoughfulness": "0", "ranking": "-"}
        return {'stat': user_stat, 'rank': ranking}

    def get_ranking(self, avatar_id):
        users = self._get_all_user_stat(avatar_id)
        ranking_keys = ['username', 'ranking', 'thoughfulness']
        ranking = []
        for user in users:
            ranking.append({i: user[i] for i in ranking_keys})
        return ranking

    def get_user_login(self, email):
        self._init_con()
        self.cur.execute(sql.getUser_sql.format(email))
        result = self.cur.fetchall()
        self._close()
        return result

    def get_user_by_id(self, avatar_id):
        self._init_con()
        self.cur.execute(sql.getUserById_sql.format(avatar_id))
        result = self.cur.fetchall()
        self._close()
        return result[0]

    def insert_training_data(self, post):
        self._init_con()
        self.cur.execute(sql.updateReviewed_sql.format(post['post_id']))
        self.con.commit()
        self.cur.execute(sql.insertTraining_sql.format(post['post_id'], post['thoughtfulness'], post['post_id']))
        self.con.commit()
        self.cur.execute(sql.updateTraining_sql.format(post['post_id']))
        self.con.commit()
        self._close()

    def insert_abandoned_post(self, post):
        self._init_con()
        thoughtfulness = self._thoughtfulness_score(post['content'], 0 if post['subject']==None else 1)
        subject = "" if post['subject'] == None else post['subject'] 
        insert_sql = sql.insertAbandonedPost_sql.format(subject, post['content'], thoughtfulness)
        self.cur.execute(insert_sql)
        self.con.commit()
        post_id = self.cur.lastrowid
        self._close()
        return {"thoughtfulness": thoughtfulness, "post_id": post_id}        
        
    def delete_abandoned_post(self, post_id):
        self._init_con()
        self.cur.execute(sql.deleteAbandonedPost_sql.format(post_id))
        self.con.commit()
        self._close()
    
    def set_user_name(self, user):
        self._init_con()
        agreed = 1 if user['agreed'] else 0
        telegram_account = user['telegram_account']
        if telegram_account[0] == '@':
            telegram_account = telegram_account[1:]
        self.cur.execute(sql.setUserName_sql.format(user['username'], agreed, telegram_account, user['userId']))
        self.con.commit()
        self._close()

    def get_topics(self):
        self._init_con()
        self.cur.execute(sql.getTopics_sql)
        topics = self.cur.fetchall()
        self._close()
        return list(topics)
            
    def _get_ranking_percentile(self, avatar_id):
        self.cur.execute(sql.getStat_sql.format(avatar_id))
        users = list(self.cur.fetchall())
        ranking = 1
        for user in users:
	    if user['avatar_id'] == avatar_id:
		return np.power(2, ranking/float(len(users)))
            ranking += 1
	return 2
    
    def _thoughtfulness_score(self, content, q_a):
	start_time = time.time()
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
	end_time = time.time()
	print end_time-start_time
        X = np.column_stack([self.v1,self.v2,self.v3,self.v4,self.v5,self.v6,self.v7,self.v8,self.v9,self.v10,self.v11,v12])
        filename = "/home/avsingh/rfr_model.sav"
        rfr = joblib.load(filename)
        mark = rfr.predict(X)[0]
        return round(mark,2)
            
    def _qacoin(self, content, q_a, avatar_id):
        qaf = self._get_ranking_percentile(avatar_id)
        score = self._thoughtfulness_score(content, q_a)
        qa_coin = qaf * score
        return qa_coin

    def _insert_thought_sim(self, post_id):
	self.cur.execute(sql.newUserThought_insert_sql.format(post_id, self.v1,self.v2,self.v3,self.v4,self.v5,self.v6,self.v7,self.v8,self.v9,self.v10,self.v11))
        self.con.commit()

    def set_vote(self, post_id, avatar_id, vote):
        self._init_con()
        self.cur.execute(sql.vote_sql.format(
            post_id, 
            avatar_id, 
            self._date()+" "+self._time(),
            vote,
            self._date()+" "+self._time(),
            vote))
        self.con.commit()
        self._close()

    def get_sessions(self, avatar_id):
        self._init_con()
        self.cur.execute(sql.getSessions_sql.format(avatar_id))
        sessions = self.cur.fetchall()
        self._close()
        return list(sessions)

    def get_new_thoughtfulness(self, post):
	if not post['subject']:
	    thought = self._thoughtfulness_score(post['content'], 0)
	else:
	    thought = self._thoughtfulness_score(post['content'], 1)
        return {"new_thoughtfulness":thought}
        

    
    
    
