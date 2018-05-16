# -*- coding: utf-8 -*-
"""
Created on Tue Sep 12 09:47:50 2017

@author: T460
"""
import nltk
from nltk.tag import StanfordNERTagger
from nltk.tokenize import word_tokenize
from nltk.parse.stanford import StanfordParser
from collections import Counter
from urlextractor import URLExtract
import regex as re
import operator
from formula_re import formula_reg
from itertools import groupby, chain
from operator import itemgetter


import os
java_path = "/opt/jdk1.8.0_144/bin/java"
os.environ['JAVA_HOME'] = java_path

#test = "How to use the LN function in Excel? google.com What is the relationship between nature logarithm and exp? www.smu.edu.sg"
#doc = 'google.com'
#doc = data.iloc[1,10]

def clean_url(doc):
    extractor = URLExtract()
    urls = list(set(extractor.find_urls(doc)))
    if len(urls) > 0:
        with_url = doc.split()
        remove_url = ' '.join(filter(lambda x: x not in urls, with_url))
        remove_url = remove_url.lower()
    else:
        remove_url = doc.lower()
    return remove_url
#clean_url(test)

def formula_ind(doc):
    remove_url = clean_url(doc)
    words = remove_url.split()
    formula = []
    for i in range(len(words)):
        if re.search(formula_reg, words[i]):
            formula.append(2)
        elif re.search(r"(\+)|(\-)|(\*)|(\/)|(\=)|[0-9]", words[i]):
            formula.append(1)
        else:
            formula.append(0)
    indices0 = [i for i,x in enumerate(formula) if x != 0]
    indices2 = [i for i,x in enumerate(formula) if x == 2]
    group = []
    for k, g in groupby(enumerate(indices0), lambda (index, item): index - item):
        group.append(map(itemgetter(1), g))
    ind = [j for j in group if any(i in indices2 for i in j)]
    return ind
    
def clean_formula(doc):    
    ind = formula_ind(doc)
    flat_ind = list(chain(*ind))
    remove_url = clean_url(doc)
    words = remove_url.split()
    words = [i for j, i in enumerate(words) if j not in flat_ind]
    remove_formula = ' '.join(words)
    return remove_formula
#clean_formula(test)

def formula_count(doc):
    ind = formula_ind(doc)
    return len(ind)
    
def average_number_of_characters_per_word(doc):
    remove_url = clean_formula(doc)
    filtered = ''.join(filter(lambda x: x not in '".,;!-?', remove_url))
    words = filtered.split()
    if words:
        average = sum(len(word) for word in words) / len(words)
    else:
        average = 0
    return average  
#average_number_of_characters_per_word(doc)

def average_number_of_words_per_sentence(doc):
    remove_url = clean_formula(doc)
    words = word_tokenize(remove_url)
    terminal = set(['?','.','!', ';'])
    terminal_count = sum(1 for word in words if word in terminal)
    filtered = ''.join(filter(lambda x: x not in '".,;!-?', remove_url))
    filtered_words = filtered.split()
    if terminal_count > 0:
        average = len(filtered_words)  / terminal_count
    else:
        average = 0
    return average 
#average_number_of_words_per_sentence(test)

def number_of_words(doc):
    remove_url = clean_formula(doc)
    filtered = ''.join(filter(lambda x: x not in '".,;!-?', remove_url))
    words = filtered.split()
    count = len(words)
    return count
#number_of_words(test)

def discourse_relations_score(doc):
    remove_url = clean_formula(doc)
    comparison = ["although", "as though", "but", "by comparison", "even if", "even though", "however", "nevertheless", "on the other hand", "still", "then", "though", "while", "yet", "and", "meanwhile", "in turn", "next", "ultimately", "meantime", "also", "as if", "even as", "even still", "even then", "regardless", "when", "by contrast", "conversely", "if", "in contrast", "instead", "nor", "or", "rather", "whereas", "while", "yet", "even after", "by contrast", "nevertheless", "besides", "much as", "as much as", "whereas", "neither", "nonetheless", "even when", "on the one hand", "indeed", "finally", "in fact", "separately", "in the end", "on the contrary", "while"]
    expansion = ["accordingly", "additionally", "after", "also", "although", "and", "as", "as it", "as if",  "besides", "but", "by comparison", "finally", "first", "for example", "for one thing", "however", "in addition", "in fact", "in other words", "in particular", "in response", "in sum", "in the end", "in turn", "incidentally", "indeed", "instead", "likewise", "meanwhile", "nevertheless", "on the one hand", "on the whole", "overall", "plus", "separately", "much as", "whereas", "ultimately", "as though", "rather", "at the same time", "or", "then", "if", "in turn", "furthermore", "in short", "turns out", "while", "yet", "that is", "so", "what’s more", "as a matter of fact", "further", "in return", "moreover", "similarly", "specifically"]
    contingency = ["and", "when", "typically", "as long as", "especially if", "even if", "even when", "if", "so", "when", "if only", "lest,once", "only if", "only when", "particularly if", "at least partly because", "especially as", "especially because", "especially since", "in large part because", "just because", "largely because", "merely because", "not because", "not only because", "particularly as", "particularly because", "particularly since", "partly because", "because", "simply because", "since", "then", "after", "one day after", "reportedly after", "consequently", "mainly because", "for", "thus", "apparently", "in the end", "in turn", "primarily because", "largely as a result", "as", "because", "therefore", "only because", "particularly", "when", "so that", "thereby", "presumably", "hence", "as a result", "if and when", "unless", "until", "in part because", "now that", "perhaps because", "only after", "accordingly"]
    combine = comparison + expansion + contingency
    filtered = ''.join(filter(lambda x: x not in '".,;!-?', remove_url))
    words = filtered.split()
    moving_window_4 = [" ".join(words[i:i+4]) for i in range(len(words) - 3)]
    moving_window_3 = [" ".join(words[i:i+3]) for i in range(len(words) - 2)]
    moving_window_2 = [" ".join(words[i:i+2]) for i in range(len(words) - 1)]
    count_4 = sum(1 for item in moving_window_4 if item in combine)
    count_3 = sum(1 for item in moving_window_3 if item in combine)
    count_2 = sum(1 for item in moving_window_2 if item in combine)
    count_1 = sum(1 for item in words if item in combine)
    count = count_4 + count_3 + count_2 + count_1
    return count
#discourse_relations_score(test)

def average_parse_tree_height(doc):
    remove_url = clean_formula(doc)
    parser=StanfordParser()
    sentence = remove_url.replace(';','.').replace('?','.').replace('!','.').split('.')
    sentence = [item for item in sentence if item]
    sentence = filter(operator.methodcaller('strip'), sentence)
    depth = lambda L: isinstance(L, list) and (max(map(depth, L)) + 1) if L else 1
    total_level = 0
    total_count = 0
    for s in sentence:
        if len(s.split())< 20: 
            total_level += depth(list(parser.raw_parse(s)))
            total_count += 1
    if total_count >0:
        average = total_level / total_count
    else:
        average = 0
    return average
#average_parse_tree_height(test)

def average_noun_phrases_per_sentence(doc):
    remove_url = clean_formula(doc)
    word = word_tokenize(remove_url)
    tags = nltk.pos_tag(word)
    counts = dict(Counter(tag for word,tag in tags))
    sentence = remove_url.replace(';','.').replace('?','.').replace('!','.').split('.')
    sentence = [item for item in sentence if item]
    sum_counts = 0
    noun_list = ['NN', 'NNS', 'NNP', 'NNPS']
    for item in noun_list:
        if item in counts:
            sum_counts += counts[item]
    if len(sentence) > 0:
        average = sum_counts / len(sentence)
    else:
        average = 0
    return average
#average_noun_phrases_per_sentence(data.iloc[356,10])

def average_verb_phrases_per_sentence(doc):
    remove_url = clean_formula(doc)
    word = word_tokenize(remove_url)
    tags = nltk.pos_tag(word)
    counts = dict(Counter(tag for word,tag in tags))
    sentence = remove_url.replace(';','.').replace('?','.').replace('!','.').split('.')
    sentence = [item for item in sentence if item]
    sum_counts = 0
    verb_list = ['VB', 'VBD', 'VBG', 'VBN' ,'VBP', 'VBZ']
    for item in verb_list:
        if item in counts:
            sum_counts += counts[item]
    if len(sentence) > 0:
        average = sum_counts / len(sentence)
    else:
        average = 0
    return average
    
def average_pronouns_phrases_per_sentence(doc):
    remove_url = clean_formula(doc)
    word = word_tokenize(remove_url)
    tags = nltk.pos_tag(word)
    counts = dict(Counter(tag for word,tag in tags))
    sentence = remove_url.replace(';','.').replace('?','.').replace('!','.').split('.')
    sentence = [item for item in sentence if item]
    sum_counts = 0
    pronouns_list = ['WP', 'WP$']
    for item in pronouns_list:
        if item in counts:
            sum_counts += counts[item]
    if len(sentence) > 0:
        average = sum_counts / len(sentence)
    else:
        average = 0
    return average
'''
def average_number_of_subordinate_clauses_per_sentence(doc):
    remove_url = clean_url(doc)
    parser=StanfordParser()
    sentence = remove_url.replace(';','.').replace('?','.').replace('!','.').split('.')
    sentence = [item for item in sentence if item]
    subtexts = []
    for s in sentence:
        t = list(parser.raw_parse(s))[0]
        for subtree in t.subtrees():
            if subtree.label()=="S" or subtree.label()=="SBAR":
                subtexts.append(' '.join(subtree.leaves()))
    if len(sentence) > 0:
        average = len(subtexts) / len(sentence)
    else:
        average = 0
    return average
'''

def average_number_of_subordinate_clauses_per_sentence(doc):
    remove_url = clean_formula(doc)
    parser=StanfordParser()
    sentence = remove_url.replace(';','.').replace('?','.').replace('!','.').split('.')
    sentence = [item for item in sentence if item]
    sentence = filter(operator.methodcaller('strip'), sentence)
    subtexts = []
    total_count = 0
    for s in sentence:
        if len(s.split())< 20: 
            t = list(parser.raw_parse(s))[0]
            total_count += 1
            for subtree in t.subtrees():
                if subtree.label()=="S" or subtree.label()=="SBAR":
                    subtexts.append(' '.join(subtree.leaves()))
    if total_count > 0:
        average = len(subtexts) / total_count
    else:
        average = 0
    return average
#average_number_of_subordinate_clauses_per_sentence(test)

'''split by clauses
for i in reversed(range(len(subtexts)-1)):
    subtexts[i] = subtexts[i][0:subtexts[i].index(subtexts[i+1])]
'''    

def number_of_links(doc):
    extractor = URLExtract()
    urls = list(set(extractor.find_urls(doc)))
    count = len(urls)
    return count
#number_of_links(test)

def type_of_question(doc):
    remove_url = clean_formula(doc)
    sentence = remove_url.replace(';','.').replace('?','.').replace('!','.').split('.')
    sentence = [item for item in sentence if item]
    type_list = ['where', 'what', 'how', 'when', 'why']
    tag_list = ["COUNTIF", "CONCATENATE", "SUMIF", "AutoFilter", "SUM",
              "AVERAGE", "SUMIF", "COUNT", "ROUNDUP", "ROUNDDOWN",
              "INT", "MAX", "MIN",
              "SLOPE", "INTERCEPT",
              "LOOKUP", "VLOOKUP", "HLOOKUP", "MATCH", "INDEX",
              "PMT", "PV", "FV", "NPER", "IRR", "RATE", "NPV",
              "RAND", "RANDBETWEEN",
              "SMALL", "PERCENTILE", "LARGE",
              "TODAY", "YEAR", "MONTH", "DATE", "NOW", "TIME",
              "HOUR", "MINUTE", "SECOND",
  "LN", "EXP", "NORMDIST", "NORMSDIST", "CRITBINOM", "NORMINV", "BINOMDIST", 
  "NORMSINV", "BETAINV", "POISSON", "LOGINV", "EXPONDIST", "FREQUENCY", "BINOM.INV", 
  "SQRT", "GAMMAINV"]
    tag_list = [tag.lower() for tag in tag_list]
    score = 0
    for s in sentence:
        words = word_tokenize(s)
        tags = [item for item in words if item in tag_list]
        if len(tags) > 0 :
            types = [item for item in words if item in type_list]
            for type_item in types:
                score += type_list.index(type_item) + 1
    return score

#type_of_question(test)