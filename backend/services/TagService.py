import MySQLdb
from datetime import *
import string
from config import config
from config import sql
import nltk
import re
import pandas as pd
from nltk.stem.porter import *
import numpy as np
from gensim.models.doc2vec import Doc2Vec
from sklearn.metrics.pairwise import cosine_similarity

class Tag():
    def __init__(self, new_doc):
        self.new_doc = new_doc
        self.sim = []
	self.x = []
	self.y = []

    def _load_data(self):
	with open(config.tag_x, 'r') as f:
    		sentences = [s for s in f.read().split('\n') if s]
    		for sentence in sentences:
        		self.x.append([float(i) for i in sentence.split()[0].split(',')])
	with open(config.tag_y, 'r') as f:
    		sentences = [s for s in f.read().split('\n') if s]
    		for sentence in sentences:
        		self.y.append([int(i) for i in sentence.split()[0].split(',')])
	self.model = Doc2Vec.load(config.tag_model)

    def _cal_sim(self):
	stemmer = PorterStemmer()
	stop_list = nltk.corpus.stopwords.words('english')
	doc1 = self.new_doc.lower().split()
	words = [re.sub(r'[^a-z]+', '', x) for x in doc1]
	words = [w for w in words if w not in stop_list]
	doc1 = [stemmer.stem(w) for w in words]
	print doc1
	X_test = self.model.infer_vector(doc1)
	cos = cosine_similarity(X_test.reshape(1,-1), self.x)
	top3 = cos[0][np.argsort(cos[0])[-3:]]
	pos = [b for b,s in enumerate(cos[0]) if s >= min(top3)]
	print pos
	label = []
	for j in pos:
    		label.append(self.y[j])
	predictions=list(set(x for l in label for x in l))
        for p in predictions:
            self.sim.append((1, int(p)))

    def newTag(self):
        self._load_data()
        self._cal_sim()
