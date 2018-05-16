import MySQLdb
from datetime import *
import string
from config import config
from config import sql
import nltk
from nltk.tokenize import word_tokenize
from nltk.probability import FreqDist
import re
import pandas as pd
from nltk.stem.porter import *
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
import scipy

def _join_data(df):
    joined_str = ""
    cols = ['intro', 'description', 'syntax']
    for col in cols:
        if pd.notnull(df[col]):
            if len(joined_str) > 0:
                joined_str += " "
            joined_str += df[col]
    return joined_str

class Tag():
    def __init__(self, new_doc):
        self.new_doc = new_doc
        self.data = pd.read_csv(config.file_name, encoding=config.encoding)
        self.sim = []

    def _load_data(self):
        self.data['description'] = self.data['description'].astype(str)
        self.data['syntax'] = self.data['syntax'].astype(str)
        self.data['des'] = self.data[['tag', 'intro', 'description', 'syntax']].apply(_join_data, axis=1)
        self.data = self.data.append({'tag':'new', 'des':self.new_doc}, ignore_index=True)
        self.data['word'] = self.data.apply(lambda x: word_tokenize(x['des']), axis=1)

    def _get_corpus(self):
        stemmer = PorterStemmer()
        data_list = self.data['word'].tolist()
        datalist = [i for sublist in data_list for i in sublist]
        stop_list = nltk.corpus.stopwords.words('english')
        stop_list += ['description', 'syntax', 'example', 'remarks', 'returns', 'describes']

        datalist = [w.lower() for w in datalist]
        datalist = [w for w in datalist if re.search('^[a-z]+$', w)]
        datalist = [w for w in datalist if w not in stop_list]
        datalist = list(set(datalist))

        data_list = [[w.lower() for w in sublist] for sublist in data_list]
        datalist_use = [[w for w in sublist if w in datalist] for sublist in data_list]
        datalist_use = [[stemmer.stem(w) for w in sublist] for sublist in datalist_use]

        self.data_corpus = ["".join([" "+i for i in lists]).strip() for lists in datalist_use]

    def _vectorize(self):
        tfidf_vectorizer = TfidfVectorizer(max_df = 0.5)
        count_vectorizer = CountVectorizer(max_df = 0.5)
        self.tfidf_matrix = tfidf_vectorizer.fit_transform(self.data_corpus)
        self.count_matrix = count_vectorizer.fit_transform(self.data_corpus)
        self.tfidf_feature = tfidf_vectorizer.get_feature_names()
        self.count_feature = count_vectorizer.get_feature_names()

    def _to_dense(self):
        self.tfidf_dense = scipy.sparse.csr_matrix.todense(self.tfidf_matrix)
        self.count_dense = scipy.sparse.csr_matrix.todense(self.count_matrix)

    def _cal_sim(self):
        for i in range(0, len(self.data)-1):
            self.sim.append((float(np.dot(self.tfidf_dense[i], self.tfidf_dense[len(self.data)-1].T)[0,0]), int(i + 1)))

    def newTag(self):
        self._load_data()
        self._get_corpus()
        self._vectorize()
        self._to_dense()
        self._cal_sim()
