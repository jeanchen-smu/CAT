#!/bin/bash
pip install Flask
pip install flask_jwt_extended
pip install pandas
pip install nltk
# env LDFLAGS="-I/usr/local/opt/openssl/include -L/usr/local/opt/openssl/lib" pip install mysqlclient
pip install --only-binary :all: mysqlclient
pip install gensim
pip install sklearn
pip install telegram
pip install python-telegram-bot
pip install uritools
pip install regex
pip install gevent
python api.py
