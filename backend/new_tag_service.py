import  csv

x=[]
with open("E:/thoughtfulness/tag_analysis/tag_x.csv", 'r') as f:
    sentences = [s for s in f.read().split('\n') if s]
    for sentence in sentences:
        x.append([float(i) for i in sentence.split()[0].split(',')])
		
y=[]
with open("E:/thoughtfulness/tag_analysis/tag_y.csv", 'r') as f:
    sentences = [s for s in f.read().split('\n') if s]
    for sentence in sentences:
        y.append([int(i) for i in sentence.split()[0].split(',')])
		
from gensim.models import doc2vec
model = doc2vec.Doc2Vec.load("E:/thoughtfulness/tag_analysis/tag_model")

doc1 = ["Keeping formula of rand() Hi guys, anyone knows how to stop formulas such as rand() from creating new values aside from just copy and pasting values over the formula? I want to keep the formula of lets say =rand() but I dont want the values to keep changing."]
doc1 = doc1[0].lower().split()
words = [re.sub(r'[^a-z]+', '', x) for x in doc1]
words = [w for w in words if w not in stop_list]
doc1 = [stemmer.stem(w) for w in words]
X_test = model.infer_vector(doc1)
cos = cosine_similarity(X_test.reshape(1,-1), x)

top3 = cos[0][np.argsort(cos[0])[-3:]]
pos = [b for b,s in enumerate(cos[0]) if s >= min(top3)]
label = []
print(pos)

for j in pos:
    label.append(y[j])
predictions=list(set(x for l in label for x in l))