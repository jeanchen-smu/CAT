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
    engine = create_engine("mysql://jeanchen:LARCdata9696@10.0.106.72:3307/jeanchen")
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
    sql_score = '''select sum(thoughtfulness_score) as score, avatar_id from post 
		where avatar_id in (select avatar_id from avatar where section_id='G1' 
		and is_teacher=0 and is_bot=0 and chat_id != '') group by avatar_id'''
    sql_users = 'select * from avatar where section_id=%(section)s'
    post = post.reset_index()
    for i in range(len(post)):      
        section = pd.read_sql(sql=sql_section,params={'avatarId':post['avatar_id'][i]},con=engine)
        users = pd.read_sql(sql=sql_users,params={'section':section['section_id'][0]},con=engine)
        score = pd.read_sql(sql=sql_score,params={'section':section['section_id'][0]},con=engine)
        rank=score.sort_values(['score'], ascending=False)
        expert = rank[:5]
        inactive = rank[-5:]
        noactive = users[~users['avatar_id'].isin(list(rank['avatar_id']))]
        expert_list = list(users[users['avatar_id'].isin(list(expert['avatar_id']))]['chat_id'])
        expert_list = [x for x in expert_list if x is not None]
        inactive_list = list(users[users['avatar_id'].isin(list(inactive['avatar_id']))]['chat_id'])
        inactive_list = [x for x in inactive_list if x is not None]
        noactive_list = list(noactive['chat_id'])
        noactive_list = [x for x in noactive_list if x is not None]
        telegramService.tele_push_expert(post['avatar_id'][i], post['post_id'][i], post['post_subject'][i], post['post_content'][i], expert_list)
        telegramService.tele_push_inactive(post['avatar_id'][i], post['post_id'][i], post['post_subject'][i], post['post_content'][i], inactive_list)
        telegramService.tele_push_inactive(post['avatar_id'][i], post['post_id'][i], post['post_subject'][i], post['post_content'][i], noactive_list)
    print datetime.datetime.now()        
    time.sleep(86400)
