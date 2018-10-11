#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Thu Jul  5 11:06:55 2018

@author: jeanc
"""

from datetime import *
from config import config
from config import sql
from ForumService import Forum
import random
import subprocess
import numpy as np

class Bot(Forum):
    def __init__(self):
        Forum.__init__(self)

    def newPost(self, post, thoughtfulness=None):
        self._init_con()
        user_id = post['userId']
        qacoins = 0
        subject = post['subject'].replace("'", "''")
        question = post['question'].replace("'", "''")
        is_qa_bountiful = 0
        time_limit_qa = self._date()+" "+self._time()
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
            0,
            qacoins,
            0,
            0))
        self.con.commit()
        post_id = self.cur.lastrowid
        self._close()
        p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -t '{}' -c '{}' -w web -o '{}' -l '{}'".format(
                user_id, post_id, subject.replace("\\'", "\'\"\'\"\'"), question.replace("\\'", "\'\"\'\"\'"), qacoins, time_limit_qa)
            ], shell=True)
