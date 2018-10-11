from gensim.models import doc2vec
from collections import namedtuple
import pandas as pd
import nltk
import re
from nltk.stem.porter import *
import  csv
import numpy as np

stop_list = nltk.corpus.stopwords.words('english')
data = pd.read_csv("E:/thoughtfulness/tag_analysis/tag_association.csv", encoding = "ISO-8859-1")
docs = []
stemmer = PorterStemmer()
analyzedDocument = namedtuple('AnalyzedDocument', 'words tags')
for i in range(len(data)):
    words = (data.loc[i,"title"]+' '+data.loc[i,"question"]).lower().split()
    words = [w.lower() for w in words]
    words = [re.sub(r'[^a-z]+', '', x) for x in words]
    words = [w for w in words if w not in stop_list]
    words = [stemmer.stem(w) for w in words]
    tags = [i]
    docs.append(analyzedDocument(words, tags))

model = doc2vec.Doc2Vec(vector_size = 30, min_count = 2, workers = 4, epochs=30)
model.build_vocab(docs)
model.train(docs, total_examples=model.corpus_count, epochs=model.epochs)
model.save("E:/thoughtfulness/tag_analysis/tag_model")

x=[]
for i in range(len(model.docvecs)):
    x.append(list(model.docvecs[i]))
    
data = data.fillna("none")
tag_list = pd.read_csv("E:/thoughtfulness/tag_analysis/Week-to-Week Tag_List.csv")

data['Tag 1'] = [x.lower() for x in data['Tag 1']]
data['Tag 2'] = [x.lower() for x in data['Tag 2']]
data['Tag 3'] = [x.lower() for x in data['Tag 3']]
tag_list['tag'] = [x.lower() for x in tag_list['tag']]

data = data.merge(tag_list[["tag_id","tag"]], how = "left", left_on = "Tag 1", right_on = "tag")
data = data.merge(tag_list[["tag_id","tag"]], how = "left", left_on = "Tag 2", right_on = "tag")
data = data.merge(tag_list[["tag_id","tag"]], how = "left", left_on = "Tag 3", right_on = "tag")

data = data.fillna(0)

def tagl(x):
    a = [int(x['tag_id_x'])]
    if x['tag_id_y'] != 0:
        a.append(int(x['tag_id_y']))
        if x['tag_id'] != 0:
            a.append(int(x['tag_id']))
    return a
        

data['tag_list'] = data.apply(tagl, axis=1)
y = list(data['tag_list'])

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.1, random_state=2018)

from sklearn.metrics.pairwise import cosine_similarity
cos = cosine_similarity(X_test, X_train)

predictions=[]
for i in range(cos.shape[0]):
    top3 = cos[i][np.argsort(cos[i])[-3:]]
    pos = [b for b,x in enumerate(cos[i]) if x >= min(top3)]
    label = []
    for j in pos:
        label.append(y_train[j])
    predictions.append(list(set(x for l in label for x in l)))
       

from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import jaccard_similarity_score

encoder = MultiLabelBinarizer()

encoder.fit(np.array(y))
y_test_transformed = encoder.transform(np.array(y_test))
predictions_transformed = encoder.transform(np.array(predictions))
jaccard_similarity_score(y_test_transformed,predictions_transformed)
#result: 0.1195	   

with open("E:/thoughtfulness/tag_analysis/tag_x.csv","w") as f:
    wr = csv.writer(f)
    wr.writerows(x)
	
with open("E:/thoughtfulness/tag_analysis/tag_y.csv","w") as f:
    wr = csv.writer(f)
    wr.writerows(y)
