#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Thu Dec 28 14:30:49 2017

@author: jeanc
"""
import time
from sqlalchemy import create_engine
import pandas as pd
import numpy as np

count=0

while True:
    
    engine = create_engine("mysql://jeanchen:LARCdata9696@10.0.106.72:3307/jeanchen")
    sql = 'SELECT * FROM training'
    data_sql = pd.read_sql(sql=sql,con=engine)
    
    if len(data_sql)-count>20:
    
        X = np.column_stack([data_sql['average_number_of_characters_per_word'], 
                             data_sql['average_number_of_words_per_sentence'], data_sql['number_of_words'],
                             data_sql['discourse_relations_score'], data_sql['formula_count'],
                             data_sql['average_noun_phrases_per_sentence'],data_sql['average_verb_phrases_per_sentence'],
                             data_sql['average_pronouns_phrases_per_sentence'],
                             data_sql['number_of_links'],data_sql['type_of_question'],
                             data_sql['average_number_of_subordinate_clauses_per_sentence'],
                             data_sql['q_or_a']])
        y = pd.to_numeric(data_sql['Mark'], errors='coerce')
        
        import os
        import datetime
        os.rename('/home/jeanc/rfr_model.sav','/home/jeanc/rfr_model_'+str(datetime.datetime.now())+'.sav')
        
        from sklearn.ensemble import RandomForestRegressor
        rfr = RandomForestRegressor(n_estimators=10, max_features=6, 
                                    criterion='mse', warm_start=True,
                                    max_depth=20, random_state=123)
        rfr.fit(X, y)
        
        from sklearn.externals import joblib
        
        filename='/home/jeanc/rfr_model.sav'
        
        joblib.dump(rfr,filename)
        
        count=len(data_sql)
    
    time.sleep(86400)


