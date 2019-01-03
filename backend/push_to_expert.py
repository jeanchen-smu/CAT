#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Sun Feb  4 18:05:53 2018

@author: jeanc
"""

import time
from sqlalchemy import create_engine
import pandas as pd
import numpy as np
import datetime
from services.TelegramService import Telegram

telegramService = Telegram()

while True:
    
    yesterday= str(datetime.datetime.today()-datetime.timedelta(days=1)).split()[0] + "%"
    #print yesterday
    engine = create_engine("mysql://avsingh:LARCdata9153@10.0.106.72:3307/avsingh")
    sql_post = 'SELECT * FROM post where (time_limit_qa like %(yesterday)s) and (level=1)'
    post = pd.read_sql(sql=sql_post,params={'yesterday':yesterday},con=engine)
    post = post.reset_index()    
    sql_reply = 'SELECT * FROM post where parent_id=%(parent)s'
    #print post.head()
    for postId in post['post_id']:
       reply = pd.read_sql(sql=sql_reply,params={'parent':postId},con=engine)
       if len(reply) > 0:
           post = post[post['post_id'] != postId]
    sql_section = 'select * from avatar where avatar_id=%(avatarId)s'
    sql_topic = '''select sum(association) as total_ass, topic_id
            from (select * from post_tag where post_id=%(postId)s) pt 
            left join tag_topic tt on pt.tag_id = tt.tag_id
            group by topic_id'''
    sql_score = '''select * from
                (select sum(topic_thoughtfulness), avatar_id, topic_id from 
                (select if(all_ass=0, 0, total_ass/all_ass)*thoughtfulness_score as 
                topic_thoughtfulness, avatar_id, s3.post_id, s3.topic_id from 
                (select total_ass, avatar_id, thoughtfulness_score, p.post_id, topic_id from
                (select sum(association) as total_ass, topic_id, post_id 
                from post_tag pt 
                left join tag_topic tt on pt.tag_id = tt.tag_id
                group by topic_id, post_id) s0 left join (select * from post where level > 1) p on 
                s0.post_id = p.post_id) s3 left join
                (select sum(total_ass) as all_ass, post_id from 
                (select total_ass, avatar_id, thoughtfulness_score, p.post_id, topic_id from
                (select sum(association) as total_ass, topic_id, post_id 
                from post_tag pt 
                left join tag_topic tt on pt.tag_id = tt.tag_id
                group by topic_id, post_id) s0 left join post p on 
                s0.post_id = p.post_id) s1 group by post_id) s2 on 
                s3.post_id = s2.post_id) s4 group by avatar_id, topic_id) s5 
                where avatar_id in (select avatar_id from avatar 
                where section_id=%(section)s)'''
    sql_users = 'select * from avatar where section_id=%(section)s'
    for i in range(len(post)):      
        section = pd.read_sql(sql=sql_section,params={'avatarId':post['avatar_id'][i]},con=engine)
        topic = pd.read_sql(sql=sql_topic,params={'postId':post['post_id'][i]},con=engine)
        topic['topic_id'] = topic['topic_id'].astype(int)
        users = pd.read_sql(sql=sql_users,params={'section':section['section_id'][0]},con=engine)
        score = pd.read_sql(sql=sql_score,params={'section':section['section_id'][0]},con=engine)
        score['topic_id'] = score['topic_id'].astype(int)
        score = pd.merge(score, topic, how='left', on=['topic_id'])
        score['score'] = score['total_ass'] * score['sum(topic_thoughtfulness)']/ sum(topic['total_ass'])
        rank = score.groupby(['avatar_id'], as_index=False).sum()
        rank=rank.sort_values(['score'], ascending=False)
        expert = rank[:5]
        inactive = rank[-5:]
        noactive = users[~users['avatar_id'].isin(list(rank['avatar_id']))]
        expert_list = list(users[users['avatar_id'].isin(list(expert['avatar_id']))]['chat_id'])
        expert_list = [x for x in expert_list if x is not None]
        inactive_list = list(users[users['avatar_id'].isin(list(inactive['avatar_id']))]['chat_id'])
        inactive_list = [x for x in inactive_list if x is not None]
        noactive_list = list(noactive['chat_id'])
        noactive_list = [x for x in noactive_list if x is not None]
        telegramService.tele_push_expert(post['avatar_id'][i], post['question_id'][i], post['post_subject'][i], post['post_content'][i], expert_list)
        telegramService.tele_push_inactive(post['avatar_id'][i], post['question_id'][i], post['post_subject'][i], post['post_content'][i], inactive_list)
        telegramService.tele_push_inactive(post['avatar_id'][i], post['question_id'][i], post['post_subject'][i], post['post_content'][i], noactive_list)
    print datetime.datetime.now()        
    time.sleep(86400)
