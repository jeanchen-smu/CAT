
# -*-coding=utf-8 -*-

from telegram import (ReplyKeyboardMarkup)
from telegram.ext import (Updater, CommandHandler, MessageHandler, Filters, RegexHandler,
                          ConversationHandler)

import logging
from services.TelegramService import Telegram
import subprocess
from datetime import datetime, timedelta
from config import config
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

def get_timelimit(hour):
    now = datetime.now()
    timelimit = now + timedelta(hours=hour)
    return timelimit.strftime(config.date_format)

telegramService = Telegram()

bot_token = '307726211:AAGwbZh2nQ93i3Tf8jUoE9Ag51WCercXe5c'



# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

logger = logging.getLogger(__name__)



BUTTON_REPLY, SECONDTRY, CONTENT2, TITLE, CONTENT, QACOIN, TIMELIMIT,TAGS, A,B,C,D,E,F,G,H,I,L,M,N,O,P,Q,R,S,T,U,V,X,Y,SUBMIT, CANCEL, ANSWERREPLY, ANSWER, QUESTIONID, ACCOUNT_VERIFICATION, ANSWERID, CHECK, REPLYANSWER, Q2, Q3, Q4, Q5, Q6, Q7, Q8, SUREND, LOOK_FOR_REPLY, SECONDTRY_REPLY, ANSWER2, REPLY_BUTTON = range(51)

def facts_to_str(user_data):
    facts = list()
    for key, value in user_data.items():
        facts.append('%s - %s' % (key, value))
    return "\n".join(facts).join(['\n', '\n'])

def _process_string(string):
    return string.replace("'", "\'\"\'\"\'")
'''
def button(bot, update):
    reply_keyboard = [['TITLE', 'CONTENT'],
		      ['QACOIN', 'TIMELIMIT']]
    update.message.reply_text('Please choose another field.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return BUTTON_REPLY
'''

def button_reply(bot, update, user_data):
    alltags=telegramService.getAlltagsfromDB()
    if update.message.text == 'TITLE':
        global l
        l=[]
        update.message.reply_text('Enter the title of your post.')
        return TITLE
    elif update.message.text == 'CONTENT':
        update.message.reply_text('Enter the content of your post.')
        return CONTENT
    elif update.message.text == 'QACOIN':
        update.message.reply_text('Enter the number of QA Coins you want to use. Send /skip if you dont want to proceed.')
        return QACOIN
    elif update.message.text == 'TIMELIMIT':
        update.message.reply_text('Enter the time limit (in hours). Send /skip if you dont want to proceed.')
        return TIMELIMIT
    elif update.message.text == 'TAGS':
        reply_keyboard = [['A','B','C','D','E','F','G'],
    		        ['H', 'I','L','M','N','O','P'],
                          ['Q', 'R','S','T','U','V','X','Y']]
        update.message.reply_text('Please choose the Tag-category.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'I':
        reply_keyboard = [['IF','IFERROR','INDEX','INT'],
    		        ['Intercept','IRR','ISBLANK','ISERROR'],
                          ['ISEVEN','ISNA','ISODD','ISTEXT']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'C':
        reply_keyboard = [['CCH Kindergarten','CDF','Charity Donation','Concatenate'],
    		        ['Conditional Formatting','Constraints','COUNT'],
                          ['COUNTA','COUNTIF','CRF table','Critbinom']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'S':
        reply_keyboard = [['SECOND','SLOPE','SMALL','Solver'],
    		        ['Solving method','SQRT','STDEV'],
                          ['SUM','SUMIF','Sumproduct']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'R':
        reply_keyboard = [['RAND','Randbetween','RATE'],
    		        ['ROUND','Retail Gasoline','ROUNDUP'],
                          ['Referencing','Rounddown','Revision/Sample Exam']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'O':
        reply_keyboard = [['Objective function']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'A':
        reply_keyboard = [['ABC Services','ABS','Achilles and Tortoise'],
    		        ['Alex Processing','Array Formula'],
                          ['AUTO-FILL','AVERAGE','Assignment']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'B':
        reply_keyboard = [['BINOM.INV','BINOMDIST','Black-Scholes']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'D':
        reply_keyboard = [['Data Simulation','Data Table','DATE'],
    		        ['Data Validation','DAY','Decision variables'],
                          ['Date-Time Formats']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'E':
        reply_keyboard = [['EXP','EXPONDIST'],
    		        ['Echo Office Supplies']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'F':
        reply_keyboard = [['FILL','FV','FREQUENCY'],
    		        ['F1 Night City Race'],
                          ['Frequency Distribution']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'G':
        reply_keyboard = [['Goal Seek','Grand Grocery'],
    		        ['Group Project']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'H':
        reply_keyboard = [['HLOOKUP','HOUR']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'L':
        reply_keyboard = [['LARGE','LN','LOOKUP']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'M':
        reply_keyboard = [['MATCH','MAX','MIN'],
    		        ['MINUTE','Monte Hall','MONTH'],
                          ['Multiplication Table']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'N':
        reply_keyboard = [['Nested IF','NORMDIST','NOW'],
    		        ['NPER','NPV','NORMSINV'],
                          ['NORMINV','NORMSDIST']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'P':
        reply_keyboard = [['PDF','PMF','PMT'],
    		        ['POISSON','PERCENTILE'],
                          ['Pivot Table-Chart','PV']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'Q':
        reply_keyboard = [['Quiz 2']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'T':
        reply_keyboard = [['TEXT','TIME','TRENDLINE'],
    		        ['Timer-Clicker','Trend','TODAY']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'U':
        reply_keyboard = [['Uniform Distribution']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'V':
        reply_keyboard = [['Village Coffee','VLOOKUP']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'X':
        reply_keyboard = [['XDB Bank']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text == 'Y':
        reply_keyboard = [['YEAR']]
        update.message.reply_text('Please choose the tags.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
    elif update.message.text in alltags:
        user = update.message.from_user
        logger.info("tags of %s: %s" % (user.first_name, update.message.text))
        l.append(_process_string(update.message.text.encode("utf-8")))
        user_data['tags']=tuple(l)
        if len(user_data['tags']) > 3:
            reply_keyboard = [['A','B','C','D','E','F','G'],
        		        ['H', 'I','L','M','N','O','P'],
                              ['Q', 'R','S','T','U','V','X','Y']]
            update.message.reply_text('Please choose 1- 3 tags only.',
                reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
            l=[]
            user_data['tags']=tuple(l)
            logger.info(user_data['tags'])
        else:
            logger.info(user_data['tags'])
            reply_keyboard = [['TITLE', 'CONTENT'],
        		      ['QACOIN', 'TIMELIMIT','TAGS'],
                              ['SUBMIT', 'CANCEL']]
            update.message.reply_text('Please choose QACOIN,TAGS,TIMELIMIT,SUBMIT or CANCEL.',
                reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    elif update.message.text == 'SUBMIT':
        if 'title' not in user_data:
            update.message.reply_text('Please fill in TITLE.')
            return TITLE
        elif 'content' not in user_data:
            update.message.reply_text('Please fill in CONTENT.')
            return CONTENT
        elif 'tags' not in user_data:
            reply_keyboard = [['A','B','C','D','E','F','G'],
        		        ['H', 'I','L','M','N','O','P'],
                              ['Q', 'R','S','T','U','V','X','Y']]
            update.message.reply_text('Please choose the Tag-category.',
                reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
        elif ('qacoin' not in user_data) and ('timelimit' in user_data):
            update.message.reply_text('Please fill in QACOIN. Enter the number of QA Coins you want to use. ')
            return QACOIN
        elif ('qacoin' in user_data) and ('timelimit' not in user_data):
            update.message.reply_text('Please fill in TIMELIMIT. Enter the time limit (in hours).')
            return TIMELIMIT
        else:
            if 'qacoin' not in user_data:
                user_data['qacoin'] = 0
            if 'timelimit' not in user_data:
                user_data['timelimit'] = get_timelimit(24)
	    try:
		user_data['thought'] = telegramService.thought(user_data['content'],1)
		reply_keyboard = [['YES','NO']]
		update.message.reply_text('The thoughtfulness score is ' + str(round(user_data['thought'],1)) + '\nDo you want to edit?',
			reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
                return SECONDTRY
	    except Exception as e:
	        print e
                update.message.reply_text('Failed: your post is not created')
		user_data.clear()
                return ConversationHandler.END
    elif update.message.text == 'FIRST':
        try:
	    question_id = telegramService.newPost(user_data,user_data['thought'])
        except Exception as e:
	    print e
            update.message.reply_text('Failed: your post is not created')
            user_data.clear()
            return ConversationHandler.END
        p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -t '{}' -c '{}' -w tele -o '{}' -l '{}'".format(
                user_data['chat_id'], question_id, user_data['title'], user_data['content'], user_data['qacoin'], user_data['timelimit']
            )], shell=True)
        update.message.reply_text('Your post is created')
        # telegramService.add_tag(user_data)
        user_data.clear()
        return ConversationHandler.END
    elif update.message.text == 'SECOND':
        try:
	    previous_id = telegramService.insert_abandoned_post(user_data, 1, user_data['thought'])
	    user_data['content'] = user_data['content2']
	    question_id = telegramService.newPost(user_data, user_data['thought2'], previous_id)
        except Exception as e:
	    print e
            update.message.reply_text('Failed: your post is not created')
            user_data.clear()
            return ConversationHandler.END
        p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -t '{}' -c '{}' -w tele -o '{}' -l '{}'".format(
                user_data['chat_id'], question_id, user_data['title'], user_data['content'], user_data['qacoin'], user_data['timelimit']
            )], shell=True)
        update.message.reply_text('Your post is created')
        user_data.clear()
        return ConversationHandler.END
    elif update.message.text == 'CANCEL':
        update.message.reply_text('Posting cancelled')
        user_data.clear()
        return ConversationHandler.END



def newpost(bot, update):
    reply_keyboard = [['TITLE', 'CONTENT'],
		      ['QACOIN', 'TIMELIMIT','TAGS'],
                      ['SUBMIT', 'CANCEL']]
    update.message.reply_text('Start a new post\n\n'
        'Select TITLE to begin.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    print update.message.chat_id
    return BUTTON_REPLY

def secondtry(bot, update, user_data):
    user = update.message.from_user
    user_data['chat_id'] = update.message.chat_id
    if update.message.text == 'NO':
	thought = user_data['thought']
	try:
	    question_id = telegramService.newPost(user_data,thought)
        except Exception as e:
	    print e
            update.message.reply_text('Failed: your post is not created')
            user_data.clear()
            return ConversationHandler.END
        p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -t '{}' -c '{}' -w tele -o '{}' -l '{}'".format(
                user_data['chat_id'], question_id, user_data['title'], user_data['content'], user_data['qacoin'], user_data['timelimit']
            )], shell=True)
        update.message.reply_text('Your post is created')
        user_data.clear()
        return ConversationHandler.END
    elif update.message.text == 'YES':
	update.message.reply_text('What is your edited question in detail?')
        return CONTENT2

def content2(bot, update, user_data):
    user = update.message.from_user
    logger.info("content2 of %s: %s" % (user.first_name, update.message.text))
    user_data['content2']=_process_string(update.message.text.encode("utf-8"))
    try:
	user_data['thought2']= telegramService.thought(user_data['content2'],1)
	reply_keyboard = [['FIRST','SECOND']]
	update.message.reply_text('The thoughtfulness score of edited question is ' + str(round(user_data['thought2'],1)) + '. Which one do you want to post?',
		reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
        return BUTTON_REPLY
    except Exception as e:
	print e
	update.message.reply_text('Failed: your post is not created')
	user_data.clear()
	return ConversationHandler.END


def title(bot, update, user_data):
    user = update.message.from_user
    logger.info("title of %s: %s" % (user.first_name, update.message.text))
    user_data['title']=_process_string(update.message.text.encode("utf-8"))
    reply_keyboard = [['TITLE', 'CONTENT'],
		      ['QACOIN', 'TIMELIMIT','TAGS'],
                      ['SUBMIT', 'CANCEL']]
    update.message.reply_text('Select CONTENT.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return BUTTON_REPLY

# def tags(bot, update, user_data):
#     user = update.message.from_user
#     reply_keyboard = [['Assessment','Basic','Date-Time','CAT2'],
#                 ['Exercise', 'Financial','Lookup'],
#                       ['Plot', 'Simulation','Solver/Goal Seek']]
#     update.message.reply_text('Please choose the Tag-category.',
#         reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True,resize_keyboard=True))
#     return BUTTON_REPLY


def content(bot, update, user_data):
    user = update.message.from_user
    logger.info("content of %s: %s" % (user.first_name, update.message.text))
    user_data['content']=_process_string(update.message.text.encode("utf-8"))
    reply_keyboard = [['TITLE', 'CONTENT'],
		      ['QACOIN', 'TIMELIMIT','TAGS'],
                      ['SUBMIT', 'CANCEL']]
    update.message.reply_text('Please choose QACOIN, TIMELIMIT,TAGS,SUBMIT or CANCEL.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return BUTTON_REPLY



def qacoin(bot, update, user_data):
    user = update.message.from_user
    logger.info("qacoin of %s: %s" % (user.first_name, update.message.text))
    user_qacoin = telegramService.get_user_qacoins(update.message.chat_id)
    reply_text = "You do not have enough QA Coins, please fill in QACOIN"
    reply_keyboard = [['TITLE', 'CONTENT'],
                ['QACOIN', 'TIMELIMIT','TAGS'],
                        ['SUBMIT', 'CANCEL']]
    try:
        if user_qacoin >= int(update.message.text):
            reply_text = "Please choose QACOIN, TIMELIMIT,TAGS,SUBMIT or CANCEL."
        user_data['qacoin']=update.message.text
        update.message.reply_text(reply_text,
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    except:
        update.message.reply_text("QA Coins has to be integer, please choose QACOIN.",
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return BUTTON_REPLY

def skip(bot, update):
    reply_keyboard = [['TITLE', 'CONTENT'],
		      ['QACOIN', 'TIMELIMIT','TAGS'],
                      ['SUBMIT', 'CANCEL']]
    update.message.reply_text('Please choose QACOIN, TIMELIMIT,TAGS,SUBMIT or CANCEL.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return BUTTON_REPLY

def timelimit(bot, update, user_data):
    user = update.message.from_user
    logger.info("timelimit of %s: %s" % (user.first_name, update.message.text))
    reply_keyboard = [['TITLE', 'CONTENT'],
		      ['QACOIN', 'TIMELIMIT','TAGS'],
                      ['SUBMIT', 'CANCEL']]
    try:
        user_data['timelimit']=get_timelimit(float(update.message.text))
        update.message.reply_text('Please choose QACOIN, TIMELIMIT,TAGS,SUBMIT or CANCEL.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    except:
        update.message.reply_text('Time Limit has to be a number, please choose TIMELIMIT.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))

    return BUTTON_REPLY

def cancel(bot, update, user_data):
    user = update.message.from_user
    logger.info("User %s canceled the posting process." % user.first_name)
    bot.send_message(chat_id = update.message.chat_id, text = 'Posting cancelled')
    user_data.clear()
    return ConversationHandler.END


def error(bot, update, error):
    logger.warn('Update "%s" caused error "%s"' % (update, error))

def unknown(bot, update):
    bot.send_message(chat_id = update.message.chat_id,
    text = "Commands:\n New Post: /newpost \nReply to Post: /reply \nAccount Verification: /verify")

def answer_reply(bot, update, user_data):
    if update.message.text == 'POSTID':
        update.message.reply_text('What is the id of the question/answer you are replying to?')
        return QUESTIONID
    elif update.message.text == 'REPLY':
        update.message.reply_text('What is your reply?')
        return ANSWER
    elif update.message.text == 'SUBMIT':
        if 'question_id' not in user_data:
            update.message.reply_text('Please fill in POSTID.')
            return QUESTIONID
        elif 'answer' not in user_data:
            update.message.reply_text('Please fill in REPLY.')
            return ANSWER
        else:
            user_data['chat_id'] = update.message.chat_id
            try:
                question_id, answer_id = telegramService.reply2Reply(user_data)
            except Exception as e:
                print e
                update.message.reply_text('Failed: your reply is not created')
                user_data.clear()
                return ConversationHandler.END
            update.message.reply_text('Your post is created')
            p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -a '{}' -t '{}' -c '{}' -w tele".format(
                user_data['chat_id'], question_id, answer_id, "no title", user_data['answer']
            )], shell=True)
            user_data.clear()
            return ConversationHandler.END
    elif update.message.text == 'CANCEL':
        update.message.reply_text('Posting cancelled')
        user_data.clear()
        return ConversationHandler.END

def reply(bot, update):
    reply_keyboard = [['POSTID', 'REPLY'],
                      ['SUBMIT', 'CANCEL']]
    update.message.reply_text('Start a new reply\n\n'
        'Please click on POSTID to reply.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return ANSWERREPLY

def question_id(bot, update, user_data):
    user = update.message.from_user
    logger.info("question_id of %s: %s" % (user.first_name, update.message.text))
    user_data['question_id']=update.message.text
    reply_keyboard = [['POSTID', 'REPLY'],
                      ['SUBMIT', 'CANCEL']]
    update.message.reply_text('Please click REPLY to fill in your reply.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return ANSWERREPLY

def answer(bot, update, user_data):
    user = update.message.from_user
    logger.info("answer of %s: %s" % (user.first_name, update.message.text))
    user_data['answer']=_process_string(update.message.text.encode("utf-8"))
    reply_keyboard = [['POSTID', 'REPLY'],
                      ['SUBMIT', 'CANCEL']]
    update.message.reply_text('Please click SUBMIT to submit your reply.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return ANSWERREPLY

def account_verify(bot, update, user_data):
    if update.message.text == 'VERIFY':
        user_id = update.effective_user.id
        username = update.effective_user.username
        if telegramService.verify_telgram(username):
            telegramService.upsert_chat_id(user_id, username)
            update.message.reply_text('Your account has been verified.')
            user_data.clear()
            return ConversationHandler.END
        update.message.reply_text('Failed: your account cannot be verified.')
        user_data.clear()
        return ConversationHandler.END
    elif update.message.text == 'CANCEL':
        update.message.reply_text('You have stopped the verification process.')
        user_data.clear()
        return ConversationHandler.END

def verify(bot, update):
    reply_keyboard = [['VERIFY', 'CANCEL']]
    update.message.reply_text('Please click on VERIFY to start the verification process',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return ACCOUNT_VERIFICATION

def start(bot, update):
    reply_keyboard = [['VERIFY', 'CANCEL']]
    update.message.reply_text('Please click on VERIFY to start the verification process',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return ACCOUNT_VERIFICATION

def look_for_reply(bot, update, user_data):
    if update.message.reply_to_message:
        quote = update.message.reply_to_message.text
        split = quote.split()
        if split[split.index('post:')-3] == 'has' and split[split.index('post:')-2] == 'a' and split[split.index('post:')-1] =='new':
            question_id = split[split.index('question_id:')+1]
	    user_data['answer']=_process_string(update.message.text.encode("utf-8"))
            user_data['chat_id']=update.message.chat_id
	    try:
		user_data['thought'] = telegramService.thought(user_data['answer'], 0)
		reply_keyboard = [['YES','NO']]
		bot.send_message(chat_id = update.message.chat_id, text='The thoughtfulness score is ' + str(round(user_data['thought'],1)) + '\nDo you want to edit?',
			reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
		if 'answer_id:' in split:
		    user_data['a'] = 1
		    user_data['question_id'] = split[split.index('answer_id:')+1]
                else:
                    user_data['a'] = 0
                    user_data['question_id']=question_id
                return SECONDTRY_REPLY
	    except Exception as e:
	        print e
                update.message.reply_text('Fail: your post is not created')
		user_data.clear()
                return ConversationHandler.END
        else:
            bot.send_message(chat_id = update.message.chat_id,
                text = "Please reply to a post.")
	    return ConversationHandler.END
    else:
        bot.send_message(chat_id = update.message.chat_id,
             text = "Please quote and reply to a question or use the commands below.\n\nCommands:\nNew Post: /newpost \nShow A Series Of Posts: /showall \nAccount Verification: /verify \nShow history for QA coins: /QAhistory \nShow history for Thoughtfulness Score: /Thistory")
	return ConversationHandler.END

def reply_button(bot, update, user_data):
    if update.message.text == 'FIRST':
	thought = user_data['thought']
	question_id = user_data['question_id']
	if user_data['a'] == 1:
	    reply_text = 'Your post is created.'
	    try:
		answer_id = telegramService.replyToReply(user_data, thought)
	    except Exception as e :
		print e
		reply_text = 'Failed: Your post is not created.'
		bot.send_message(chat_id=update.message.chat_id, text=reply_text)
		user_data.clear()
		return ConversationHandler.END
	else:
            reply_text = 'Your post is created.'
	    try:
		answer_id = telegramService.replyToPost(user_data, thought)
	    except Exception as e :
		print e
		reply_text = 'Failed: Your post is not created.'
		bot.send_message(chat_id=update.message.chat_id, text=reply_text)
		user_data.clear()
		return ConversationHandler.END
        p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -a '{}' -t '{}' -c '{}' -w tele".format(
                user_data['chat_id'], question_id, answer_id, "no title", user_data['answer']
            )], shell=True)
        update.message.reply_text('Your post is created')
        user_data.clear()
        return ConversationHandler.END
    elif update.message.text == 'SECOND':
	user_data['content'] = user_data['answer']
	user_data['answer'] = user_data['answer2']
	thought = user_data['thought']
	thought2 = user_data['thought2']
	previous_id = telegramService.insert_abandoned_post(user_data, 0, thought)
	question_id = user_data['question_id']
	if user_data['a'] == 1:
	    reply_text = 'Your post is created.'
	    try:
		answer_id = telegramService.replyToReply(user_data, thought2)
	    except Exception as e :
		print e
		reply_text = 'Failed: Your post is not created.'
		bot.send_message(chat_id=update.message.chat_id, text=reply_text)
		user_data.clear()
		return ConversationHandler.END
	else:
            reply_text = 'Your post is created'
	    try:
		answer_id = telegramService.replyToPost(user_data, thought2)
	    except Exception as e :
		print e
		reply_text = 'Failed: Your post is not created.'
		bot.send_message(chat_id=update.message.chat_id, text=reply_text)
		user_data.clear()
		return ConversationHandler.END
	update.message.reply_text('Your post is created')
        p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -a '{}' -t '{}' -c '{}' -w tele".format(
                user_data['chat_id'], question_id, answer_id, "no title", user_data['answer']
            )], shell=True)
        user_data.clear()
        return ConversationHandler.END

def secondtry_reply(bot, update, user_data):
    user = update.message.from_user
    user_data['chat_id'] = update.message.chat_id
    if update.message.text == 'NO':
	thought = user_data['thought']
	question_id = user_data['question_id']
	if user_data['a'] == 1:
	    reply_text = 'Your post is created'
	    try:
		answer_id = telegramService.replyToReply(user_data, thought)
	    except Exception as e :
		print e
		reply_text = 'Failed: Your post is not created.'
		bot.send_message(chat_id=update.message.chat_id, text=reply_text)
		user_data.clear()
		return ConversationHandler.END
	else:
            reply_text = 'Your post is created.'
	    try:
		answer_id = telegramService.replyToPost(user_data, thought)
	    except Exception as e :
		print e
		reply_text = 'Failed: Your post is not created.'
		bot.send_message(chat_id=update.message.chat_id, text=reply_text)
		user_data.clear()
		return ConversationHandler.END
	bot.send_message(chat_id=update.message.chat_id, text=reply_text)
        p = subprocess.Popen(["python telePushMsg.py -i '{}' -q '{}' -a '{}' -t '{}' -c '{}' -w tele".format(
                user_data['chat_id'], question_id, answer_id, "no title", user_data['answer']
            )], shell=True)
        user_data.clear()
        return ConversationHandler.END
    elif update.message.text == 'YES':
	update.message.reply_text('Enter your edited post.')
        return ANSWER2

def answer2(bot, update, user_data):
    user = update.message.from_user
    user_data['answer2']=_process_string(update.message.text.encode("utf-8"))
    try:
	user_data['thought2']= telegramService.thought(user_data['answer2'],1)
	reply_keyboard = [['FIRST','SECOND']]
	update.message.reply_text('The thoughtfulness score of edited reply is ' + str(round(user_data['thought2'],1)) + '. Which one do you want to post?',
		reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
        return REPLY_BUTTON
    except Exception as e:
	print e
	update.message.reply_text('Failed: Your post is not created.')
	user_data.clear()
	return ConversationHandler.END

def showall(bot, update):
    reply_keyboard = [['CANCEL']]
    update.message.reply_text('Please input answer_id.',
            reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return ANSWERID

def answerid(bot, update, user_data):
    if update.message.text == 'CANCEL':
        update.message.reply_text('Posting cancelled')
        user_data.clear()
        return ConversationHandler.END
    else:
        user_data['answer_id'] = int(update.message.text.encode("utf-8"))
        try:
	    posts = telegramService.allPost(user_data['answer_id'])
	    posts = posts[::-1]
	    postsID = telegramService.allPostID(user_data['answer_id'])
	    postsID = postsID[::-1]
	    postList = 'question_id: '+ postsID[0] + '\n' + posts[0]
	    for i in range(1,len(posts)):
	        postList = postList + '\n\n\n' + 'answer_id: '+ postsID[i]+ '\n' + posts[i]
	    reply_keyboard = [['YES', 'CANCEL']]
	    update.message.reply_text(postList+'\n\n\n\nDo you want to reply?',
	        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
	    return CHECK
        except Exception as e:
	    print e
	    update.message.reply_text('Sorry, I cannot find this post.\nPlease check answer_id.')
	    return ANSWERID

def check(bot, update, user_data):
    if update.message.text == 'YES':
        update.message.reply_text('Enter the content of your reply?')
	user_data['a'] = 1
        return REPLYANSWER
    elif update.message.text == 'CANCEL':
        update.message.reply_text('Posting cancelled')
        user_data.clear()
        return ConversationHandler.END


def replyanswer(bot, update, user_data):
    user_data['question_id'] = user_data['answer_id']
    user_data['answer']=_process_string(update.message.text.encode("utf-8"))
    try:
	user_data['thought'] = telegramService.thought(user_data['answer'], 0)
	reply_keyboard = [['YES','NO']]
	bot.send_message(chat_id = update.message.chat_id, text='The thoughtfulness score is ' + str(round(user_data['thought'],1)) + '\nDo you want to edit?',
		reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
        return SECONDTRY_REPLY
    except Exception as e:
	print e
        update.message.reply_text('Failed: your post is not created')
	user_data.clear()
        return ConversationHandler.END


def survey(bot, update, user_data):
    user_data['chat_id'] = update.message.chat_id
    chat_list = telegramService.Survey_chat()
    if str(user_data['chat_id']) in chat_list:
        reply_text = 'You have already completed the survey.'
	update.message.reply_text(reply_text)
        user_data.clear()
        return ConversationHandler.END
    else:
	reply_keyboard = [['1 - Strongly Disagree', '2 - Disagree'],
		      ['3 - Agree', '4 - Strongly Agree']]
	update.message.reply_text('There are 8 simple questions in this survey. Select 1 to 4 according to the scale:\n\n'
	'1 - Strongly Disagree\n2 - Disagree\n3 - Agree\n4 - Strongly Agree\n\n'
	'Q1: It is easy to use Telegram to ask and/or reply questions.',
	reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
	return Q2

def q2(bot, update, user_data):
    user_data['Q1'] = update.message.text
    reply_keyboard = [['1 - Strongly Disagree', '2 - Disagree'],
		      ['3 - Agree', '4 - Strongly Agree']]
    update.message.reply_text('Q2: The CAT Forum web platform is easy to navigate and use.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return Q3

def q3(bot, update, user_data):
    user_data['chat_id'] = update.message.chat_id
    user_data['Q2'] = update.message.text
    reply_keyboard = [['1 - Strongly Disagree', '2 - Disagree'],
		      ['3 - Agree', '4 - Strongly Agree']]
    update.message.reply_text('Q3: The system encourages me to ask question and/or reply questions.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return Q4

def q4(bot, update, user_data):
    user_data['chat_id'] = update.message.chat_id
    user_data['Q3'] = update.message.text
    reply_keyboard = [['1 - Strongly Disagree', '2 - Disagree'],
		      ['3 - Agree', '4 - Strongly Agree']]
    update.message.reply_text('Q4: I learn from the questions and/or answers posted by my peers.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return Q5

def q5(bot, update, user_data):
    user_data['chat_id'] = update.message.chat_id
    user_data['Q4'] = update.message.text
    reply_keyboard = [['1 - Strongly Disagree', '2 - Disagree'],
		      ['3 - Agree', '4 - Strongly Agree']]
    update.message.reply_text('Q5: I am motivated to ask and/or answer questions due to my Avatar identity.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return Q6

def q6(bot, update, user_data):
    user_data['chat_id'] = update.message.chat_id
    user_data['Q5'] = update.message.text
    reply_keyboard = [['1 - Strongly Disagree', '2 - Disagree'],
		      ['3 - Agree', '4 - Strongly Agree']]
    update.message.reply_text('Q6: I am motivated to ask and/or answer questions due to QA coins and leader board.',
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True))
    return Q7

def q7(bot, update, user_data):
    user_data['chat_id'] = update.message.chat_id
    user_data['Q6'] = update.message.text
    update.message.reply_text('Q7: I like this system because...')
    return Q8

def q8(bot, update, user_data):
    user_data['chat_id'] = update.message.chat_id
    user_data['Q7'] = _process_string(update.message.text.encode("utf-8"))
    update.message.reply_text('Q8: I dislike this system because...')
    return SUREND

def surveyend(bot, update, user_data):
    user_data['Q8'] = _process_string(update.message.text.encode("utf-8"))
    telegramService.Survey(user_data)
    update.message.reply_text('Survey ends.')
    user_data.clear()
    return ConversationHandler.END


def QAhistory(bot, update):
    chat_id = update.message.chat_id
    telegramService.QAhistory(chat_id)

def Thistory(bot, update):
    chat_id = update.message.chat_id
    telegramService.Thistory(chat_id)



#def main():
    # Create the EventHandler and pass it your bot's token.
updater = Updater(bot_token)
# Get the dispatcher to register handlers
dp = updater.dispatcher
# Add conversation handler with the states GENDER, PHOTO, LOCATION and BIO
conv_handler = ConversationHandler(
entry_points=[CommandHandler('newpost', newpost)],
states={
    BUTTON_REPLY: [RegexHandler('^(TITLE|CONTENT|QACOIN|TIMELIMIT|TAGS|SUBMIT|A|B|C|D|E|F|G|H|I|L|M|N|O|P|Q|R|S|T|U|V|X|Y|YEAR|XDB Bank|VLOOKUP|Village Coffee|Uniform Distribution|TRENDLINE|Trend|TODAY|Timer-Clicker|TIME|TEXT|Sumproduct|SUMIF|SUM|STDEV|SQRT|Solving method|Solver|SMALL|SLOPE|SECOND|ROUNDUP|Roundddown|ROUND|Revision/Sample Exam|Retail Gasoline|Referencing|RATE|Randbetween|RAND|Quiz 2|PV|POISSON|PMT|PMF|Pivot Table-Chart|PERCENTILE|PDF|Objective function|NPV|NPER|NOW|NORMSINV|NORMSDIST|NORMINV|NORMDIST|Nested IF|Multiplication Table|MONTH|Monte Hall|MINUTE|MIN|MAX|MATCH|LOOKUP|LN|LARGE|ISTEXT|ISODD|ISNA|ISEVEN|ISERROR|ISBLANK|IRR|Intercept|INT|INDEX|IFERROR|IF|HOUR|HLOOKUP|Group Project|Grand Grocery|Goal Seek|FV|Frequency Distribution|FREQUENCY|FILL|F1 Night City Race|EXPONDIST|EXP|Echo Office Supplies|Decision variables|DAY|Date-Time Formats|DATE|Data Validation|Data Table|Data Simulation|Critbinom|CRF table|COUNTIF|COUNTA|COUNT|Constraints|Conditional Formatting|Concatenate|Charity Donation|CDF|CCH Kindergarten|Black-Scholes|BINOMDIST|BINOM.INV|AVERAGE|AUTO-FILL|Assignment|Array Formula|Alex Processing|Achilles and Tortoise|ABS|ABC Services)$', button_reply, pass_user_data=True),
                    CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    SECONDTRY: [RegexHandler('^(YES|NO)$', secondtry, pass_user_data=True),CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    CONTENT2: [MessageHandler(Filters.text, content2, pass_user_data=True), CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    TITLE: [MessageHandler(Filters.text, title, pass_user_data=True), CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    CONTENT: [MessageHandler(Filters.text, content, pass_user_data=True), CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    #TAGS: [MessageHandler(Filters.text, tags, pass_user_data=True), CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    QACOIN: [MessageHandler(Filters.text, qacoin, pass_user_data=True),
               CommandHandler('skip', skip), CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    TIMELIMIT: [MessageHandler(Filters.text, timelimit, pass_user_data=True),
               CommandHandler('skip', skip), CommandHandler('newpost', newpost), CommandHandler('reply', reply)]
},
fallbacks=[CommandHandler('cancel', cancel)]
)
reply_handler = ConversationHandler(
entry_points=[CommandHandler('reply', reply)],
states={
    ANSWERREPLY: [RegexHandler('^(POSTID|REPLY|SUBMIT|CANCEL)$', answer_reply, pass_user_data=True),
                    CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    QUESTIONID: [MessageHandler(Filters.text, question_id, pass_user_data=True), CommandHandler('newpost', newpost), CommandHandler('reply', reply)],
    ANSWER: [MessageHandler(Filters.text, answer, pass_user_data=True), CommandHandler('newpost', newpost), CommandHandler('reply', reply)]
},
fallbacks=[CommandHandler('cancel', cancel)]
)
verify_handler = ConversationHandler(
entry_points=[CommandHandler('verify', verify)],
states={
    ACCOUNT_VERIFICATION: [RegexHandler('^(VERIFY|CANCEL)$', account_verify, pass_user_data=True),
                    CommandHandler('newpost', newpost), CommandHandler('reply', reply)]
},
fallbacks=[CommandHandler('cancel', cancel)]
)
start_handler = ConversationHandler(
entry_points=[CommandHandler('start', start)],
states={
    ACCOUNT_VERIFICATION: [RegexHandler('^(VERIFY|CANCEL)$', account_verify, pass_user_data=True),
                    CommandHandler('newpost', newpost), CommandHandler('reply', reply)]
},
fallbacks=[CommandHandler('cancel', cancel)]
)
verify_handler = ConversationHandler(
entry_points=[CommandHandler('verify', verify)],
states={
    ACCOUNT_VERIFICATION: [RegexHandler('^(VERIFY|CANCEL)$', account_verify, pass_user_data=True),
                    CommandHandler('newpost', newpost), CommandHandler('reply', reply)]
},
fallbacks=[CommandHandler('cancel', cancel)]
)
showall_handler = ConversationHandler(
entry_points=[CommandHandler('showall', showall)],
states={
    ANSWERID: [MessageHandler(Filters.text, answerid, pass_user_data=True),
                    CommandHandler('showall', showall)],
    CHECK: [RegexHandler('^(YES|CANCEL)$', check, pass_user_data=True), CommandHandler('cancel', cancel)],
    REPLY_BUTTON: [RegexHandler('^(FIRST|SECOND)$', reply_button, pass_user_data=True),
                    CommandHandler('showall', showall)],
    SECONDTRY_REPLY: [RegexHandler('^(YES|NO)$', secondtry_reply, pass_user_data=True),CommandHandler('showall', showall)],
    REPLYANSWER: [MessageHandler(Filters.text, replyanswer, pass_user_data=True),
                    CommandHandler('showall', showall)],
    ANSWER2: [MessageHandler(Filters.text, answer2, pass_user_data=True), CommandHandler('showall', showall)]
},
fallbacks=[CommandHandler('cancel', cancel)]
)
survey_handler = ConversationHandler(
entry_points=[CommandHandler('survey', survey, pass_user_data = True)],
states={
    Q2: [RegexHandler('^(1 - Strongly Disagree|2 - Disagree|3 - Agree|4 - Strongly Agree)$', q2, pass_user_data=True)],
    Q3: [RegexHandler('^(1 - Strongly Disagree|2 - Disagree|3 - Agree|4 - Strongly Agree)$', q3, pass_user_data=True)],
    Q4: [RegexHandler('^(1 - Strongly Disagree|2 - Disagree|3 - Agree|4 - Strongly Agree)$', q4, pass_user_data=True)],
    Q5: [RegexHandler('^(1 - Strongly Disagree|2 - Disagree|3 - Agree|4 - Strongly Agree)$', q5, pass_user_data=True)],
    Q6: [RegexHandler('^(1 - Strongly Disagree|2 - Disagree|3 - Agree|4 - Strongly Agree)$', q6, pass_user_data=True)],
    Q7: [RegexHandler('^(1 - Strongly Disagree|2 - Disagree|3 - Agree|4 - Strongly Agree)$', q7, pass_user_data=True)],
    Q8: [MessageHandler(Filters.text, q8, pass_user_data=True)],
    SUREND: [MessageHandler(Filters.text, surveyend, pass_user_data=True)],
},
fallbacks=[CommandHandler('cancel', cancel)]
)
re_handler = ConversationHandler(
entry_points=[MessageHandler(Filters.text, look_for_reply, pass_user_data=True)],
states={
    REPLY_BUTTON: [RegexHandler('^(FIRST|SECOND)$', reply_button, pass_user_data=True),
                    CommandHandler('look_for_reply', look_for_reply)],
    SECONDTRY_REPLY: [RegexHandler('^(YES|NO)$', secondtry_reply, pass_user_data=True),CommandHandler('look_for_reply', look_for_reply)],
    ANSWER2: [MessageHandler(Filters.text, answer2, pass_user_data=True), CommandHandler('look_for_reply', look_for_reply)]
},
fallbacks=[CommandHandler('cancel', cancel)]
)
dp.add_handler(conv_handler)
dp.add_handler(reply_handler)
dp.add_handler(verify_handler)
dp.add_handler(start_handler)
dp.add_handler(showall_handler)
dp.add_handler(survey_handler)
dp.add_handler(CommandHandler('QAhistory', QAhistory))
dp.add_handler(CommandHandler('Thistory', Thistory))
#unknown_handler = MessageHandler(Filters.text, unknown)
#dp.add_handler(unknown_handler)
dp.add_handler(re_handler)
# log all errors
dp.add_error_handler(error)
# Start the Bot
updater.start_polling(timeout=604800)
# Run the bot until the you presses Ctrl-C or the process receives SIGINT,
# SIGTERM or SIGABRT. This should be used most of the time, since
# start_polling() is non-blocking and will stop the bot gracefully.
updater.idle()


#if __name__ == '__main__':
#    main()
