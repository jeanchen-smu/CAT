###Avatar###
getStat_sql = """SELECT (ifnull(qa_gain,0)-ifnull(qa_lost, 0)+ifnull(s3.qacoin, 0)-ifnull(s4.qacoin, 0)) AS qacoins, section_id, username, thoughfulness, s0.avatar_id FROM
((SELECT p.avatar_id, a.avatar_name AS username, IFNULL(SUM(qa_coin_basic),0) AS qa_gain, section_id,
IFNULL(SUM(thoughtfulness_score),0) AS thoughfulness FROM avatar a, post p WHERE a.avatar_id = p.avatar_id and section_id=(select section_id from avatar where avatar_id={}) GROUP BY p.avatar_id) s0
LEFT JOIN (SELECT avatar_id, IFNULL(SUM(qa_coin_bounty),0) AS qa_lost FROM post po WHERE time_limit_qa>CURDATE() GROUP BY avatar_id) s1
on s0.avatar_id = s1.avatar_id) left join (select p.post_id as post_id, p.avatar_id as giver_id, po.avatar_id as receiver_id, po.post_id as answer_id, p.qa_coin_bounty as qacoin
from post p join post po on p.post_id = po.question_id where p.time_limit_qa>=NOW() and p.qa_coin_bounty>0 and po.thoughtfulness_score>=2
and po.timestamp < p.time_limit_qa order by  po.thoughtfulness_score desc limit 1) s3 on s0.avatar_id = s3.receiver_id
left join (select p.post_id as post_id, p.avatar_id as giver_id, po.avatar_id as receiver_id, po.post_id as answer_id, p.qa_coin_bounty as qacoin
from post p join post po on p.post_id = po.question_id where p.time_limit_qa>=NOW() and p.qa_coin_bounty>0 and po.thoughtfulness_score>=2
and po.timestamp < p.time_limit_qa order by  po.thoughtfulness_score desc limit 1) s4 on s0.avatar_id = s4.giver_id
 ORDER BY thoughfulness DESC"""

setUserName_sql = """UPDATE avatar SET avatar_name='{}', agreed={}, telegram_account='{}' WHERE avatar_id={}"""

getUser_sql = """SELECT * FROM avatar WHERE email='{}' and expiry_date > CURDATE()"""

getUserById_sql = """SELECT * FROM avatar WHERE avatar_id={} and expiry_date > CURDATE()"""

newUser_sql = """INSERT INTO avatar (avatar_id, avatar_name, icon, avatar_qa_coin, avatar_thoughtfulness_score, section_id, is_bot)
                VALUES (%s, %s, %s, 0, 0, %s, 0)"""

userData_sql = "SELECT * FROM avatar WHERE avatar_id = %s"

profUserData_sql = "SELECT * FROM avatar WHERE section_id = %s"

updateUserQA_select_sql = "SELECT qa_coins FROM avatar_qa_coin WHERE avatar_id = %s ORDER BY `timestamp` DESC"

updateUserQA_update_sql = "UPDATE avatar SET avatar_qa_coin = %s WHERE avatar_id = %s"

updateUserThought_select_sql = "SELECT thoughtfulness_score FROM avatar_thoughtfulness_score WHERE avatar_id = %s ORDER BY `timestamp` DESC"

updateUserThought_update_sql = "UPDATE avatar SET avatar_thoughtfulness_score = %s WHERE avatar_id = %s"

userUnreadCount_select_sql = "SELECT post_id FROM post WHERE avatar_id = %s"

userUnreadCount_count_sql = "SELECT COUNT(*) FROM post WHERE parent_id IN ('+','.join(map(str,%s))+')"

_idOfName_sql = "SELECT avatar_id FROM avatar WHERE avatar_name = %s"

changeName_sql = "UPDATE avatar SET avatar_name = %s WHERE avatar_id = %s"

changeIcon_sql = "UPDATE avatar SET icon = %s WHERE avatar_id = %s"


###Post###
newPost_sql = """INSERT INTO post (avatar_id, post_subject, 
                post_content, level, is_question, is_bot, `timestamp`, 
                is_qa_bountiful, time_limit_qa, time_limit_bot, qa_coin_basic,
                qa_coin_bounty, thoughtfulness_score, previous_id)
                VALUES ({}, '{}', '{}', 1, 1, {}, '{}', {}, '{}', '{}', {}, {}, {}, {})"""

replyToPost_select_sql = "SELECT level FROM post WHERE post_id = %s"

replyToPost_insert_sql = """INSERT INTO post (avatar_id, post_content, level, is_question,
                            is_bot, `timestamp`, question_id, qa_coin_basic, 
                            thoughtfulness_score, parent_id, previous_id)
                            VALUES ({}, '{}', {}, 0, {}, '{}', {}, {}, {}, {}, {})"""

getPosts_sql = """SELECT post_id as 'key', post_subject as subject, 
                qa_coin_bounty as qacoins, timestamp as date, 
                (select count(*) from post	where question_id = p.post_id) as commentCounts,
                (select count(*) from post where (isnull(reviewed) or reviewed=0) and 
                (post_id=p.post_id or question_id=p.post_id)) as reviewCounts,
                avatar_name as username FROM post p, avatar a 
                WHERE is_question = 1 and p.avatar_id = a.avatar_id and 
                (section_id=(select section_id from avatar where avatar_id={}) or section_id in (select section from a_section where avatar_id={}))
                ORDER BY `timestamp` DESC"""

getPost_sql = """SELECT post_id AS questionId, avatar_name AS username, p.avatar_id as userId,
                timestamp AS date, post_subject As subject, post_content AS question,
                reviewed, thoughtfulness_score, 
                (select ifnull((select upvotes from (select post_id, count(*) as upvotes from vote where vote=1 group by post_id)  uv where  uv.post_id=p.post_id), 0)) as upvotes,
                (select ifnull((select downvotes from (select post_id, count(*) as downvotes from vote where vote=2 group by post_id)  dv where  dv.post_id=p.post_id), 0)) as downvotes,
                (select ifnull((select vote from vote where post_id=p.post_id and avatar_id={}),0) ) as uservote
                FROM post p, avatar a WHERE p.avatar_id = a.avatar_id AND post_id = {}"""

getAnswer_sql = """SELECT post_id AS answerId, parent_id, level, avatar_name AS username, 
                (SELECT avatar_name FROM avatar WHERE avatar_id = 
                (SELECT avatar_id FROM post WHERE post_id = p.parent_id)) AS pUserName,
                timestamp AS date, post_content AS answer, reviewed, thoughtfulness_score,
                (select ifnull((select upvotes from (select post_id, count(*) as upvotes from vote where vote=1 group by post_id)  uv where  uv.post_id=p.post_id), 0)) as upvotes,
                (select ifnull((select downvotes from (select post_id, count(*) as downvotes from vote where vote=2 group by post_id)  dv where  dv.post_id=p.post_id), 0)) as downvotes,
                (select ifnull((select vote from vote where post_id=p.post_id and avatar_id={}),0) ) as uservote 
                FROM post p, avatar a 
                WHERE p.avatar_id = a.avatar_id AND question_id = {}"""

updateReviewed_sql = """UPDATE post SET reviewed=1 WHERE post_id={}"""

getPostsByTopic_sql = """SELECT post_id as 'key', post_subject as subject, 
                qa_coin_bounty as qacoins, timestamp as date, 
                (select count(*) from post	where question_id = p.post_id) as commentCounts,
                (select count(*) from post where (isnull(reviewed) or reviewed=0) and 
                (post_id=p.post_id or question_id=p.post_id)) as reviewCounts,
                avatar_name as username FROM post p, avatar a 
                WHERE is_question = 1 and p.avatar_id = a.avatar_id and post_id in (select post_id from post_tag where tag_id in (select tag_id from 
                tag_topic where topic_id ={}) and association > {}) and 
                (section_id=(select section_id from avatar where avatar_id={}) or section_id in (select section from a_section where avatar_id={}))
                ORDER BY `timestamp` DESC"""

unreadPosts_parentid_sql = """SELECT post_id FROM post WHERE avatar_id = %s"""

unreadPosts_sql = """SELECT post_content FROM post WHERE is_question = 0 AND parent_id IN (%s) AND read = 0 ORDER BY `timestamp` DESC"""

Posts_sql = "SELECT * FROM post WHERE question_id = %s"

updateThought_select_sql = "SELECT thoughtfulness_score FROM thoughtfulness WHERE posi_id = %s"

updateThought_update_sql = "UPDATE post SET thoughtfulness_score = %s WHERE posi_id = %s"

updateQA_score_sql = "SELECT thoughtfulness_score FROM thoughtfulness WHERE posi_id = %s"

updateQA_QAF_sql = "SELECT qaf FROM qaf WHERE posi_id = %s"

updateQA_update_sql = "UPDATE post SET qa_coin_basic = %s WHERE posi_id = %s"

###Thoughtfulness###
contentOfPost_sql = "SELECT post_content FROM post WHERE post_id = %s"

###vote###
newUpvote_sql = """INSERT INTO vote(avatar_id, post_id, upvote, `timestamp`)
                VALUES(%s, %s, 1, %s)"""

newDownvote_sql = """INSERT INTO vote(avatar_id, post_id, downvote, `timestamp`)
                VALUES(%s, %s, 1, %s)"""

###QAcin###
newUserQA_select_sql = "SELECT SUM(qa_coin_basic), MAX(`timestamp`) FROM post WHERE avatar_id = %s GROUP BY avatar_id"

newUserQA_insert_sql = "INSERT INTO avatar_qa_coin(`timestamp`, qa_coins, avatar_id)VALUES(%s, %s, %s)"

###ThoughtfulnessScore###
newUserThought_select_sql = """SELECT SUM(thoughtfulness_score), MAX(`timestamp`) FROM post
                            WHERE avatar_id = %s GROUP BY avatar_id"""

newUserThought_insert_sql = """insert into thoughtfulness_score (post_id,
				average_number_of_characters_per_word,
				average_number_of_words_per_sentence,
				number_of_words, 
				discourse_relations_score,
				formula_count,
				average_noun_phrases_per_sentence,
				average_verb_phrases_per_sentence,
				average_pronouns_phrases_per_sentence,
				number_of_links,
				type_of_question,
				average_number_of_subordinate_clauses_per_sentence) VALUES 
				({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})"""


###QAF###
newQAF_select_sql = "SELECT MAX(post_id), MAX(`timestamp`), COUNT(post_id) FROM post WHERE avatar_id = %s GROUP BY avatar_id"

newQAF_insert_sql = "INSERT INTO qaf(avatar_id, post_id, qaf, `timestamp`)VALUES(%s, %s, %s, %s)"

###Tag###
newTag_sql = """INSERT INTO post_tag(tag_id, post_id, association) 
                VALUES {}"""

getTags_sql = """SELECT tag_id AS 'key', tag AS label FROM tag WHERE tag_id IN 
            (SELECT tag_id FROM post_tag WHERE post_id = {} 
            AND association >= {})"""

getAllTags_sql = """SELECT * FROM tag where tag_id in (select tag_id from post_tag where 
                association<={} and post_id={})"""

updatePostTag_sql = """UPDATE post_tag SET association={} WHERE post_id={} and tag_id={}"""

###abandoned_post###
insertAbandonedPost_sql = """INSERT INTO abandoned_post(post_subject, post_content, thoughtfulness_score)
VALUES ('{}','{}',{})"""

deleteAbandonedPost_sql = """DELETE FROM abandoned_post WHERE post_id={}"""

getTopics_sql = "SELECT * FROM topic"

getChatId_sql = """SELECT chat_id from avatar where """

teleNewPost_sql = """INSERT INTO post (avatar_id, post_subject, 
                post_content, level, is_question, is_bot, `timestamp`, 
                is_qa_bountiful, time_limit_qa, time_limit_bot, qa_coin_basic,
                qa_coin_bounty, thoughtfulness_score, previous_id)
                VALUES ((SELECT avatar_id from avatar where chat_id={}), 
                '{}', '{}', 1, 1, {}, '{}', {}, '{}', '{}', {}, {}, {}, {})"""

teleGetChatId = """select * from avatar where not isnull(chat_id) and
                    chat_id != '' and 
                    section_id=(select section_id from avatar where 
                    chat_id='{}')"""

webGetChatId = """select * from avatar where not isnull(chat_id) and 
                    chat_id != '' and 
                    section_id=(select section_id from avatar where 
                    avatar_id={})"""

teleGetAvatarId = """select * from avatar where not isnull(chat_id) and
                    chat_id != '' and 
                    section_id=(select section_id from avatar where 
                    avatar_id='{}')"""

teleReplyToPost_insert_sql = """INSERT INTO post (avatar_id, post_content, level, is_question,
                            is_bot, `timestamp`, question_id, qa_coin_basic, 
                            thoughtfulness_score, parent_id)
                            VALUES ((SELECT avatar_id from avatar where chat_id={}),
                             '{}', {}, 0, {}, '{}', {}, {}, {}, {})"""

teleReplyToReply_insert_sql = """INSERT INTO post (avatar_id, post_content, level, is_question,
                            is_bot, `timestamp`, question_id, qa_coin_basic, 
                            thoughtfulness_score, parent_id)
                            VALUES ((SELECT avatar_id from avatar where chat_id={}),
                             '{}', (select level from (select * from post) a where post_id={})+1, 0, {}, '{}', (select question_id from (select * from post) b where post_id={}), {}, {}, {})"""

teleReply2Reply_insert_sql = """INSERT INTO post (avatar_id, post_content, level, is_question,
                            is_bot, `timestamp`, question_id, qa_coin_basic, 
                            thoughtfulness_score, parent_id)
                            VALUES ((SELECT avatar_id from avatar where chat_id={}),
                             '{}', (select level from (select * from post) a where post_id={})+1, 0, {}, '{}', (select if(question_id=0, {}, question_id) from (select * from post) b where post_id={}), {}, {}, {})"""

teleGetStat_sql = """SELECT (ifnull(qa_gain,0)-ifnull(qa_lost, 0)+ifnull(s3.qacoin, 0)-ifnull(s4.qacoin, 0)) AS qacoins, section_id, username, thoughfulness, s0.chat_id, s0.avatar_id FROM
((SELECT p.avatar_id, a.avatar_name AS username, IFNULL(SUM(qa_coin_basic),0) AS qa_gain, section_id,
IFNULL(SUM(thoughtfulness_score),0) AS thoughfulness, chat_id FROM avatar a, post p WHERE a.avatar_id = p.avatar_id and section_id=(select section_id from avatar where chat_id='{}') GROUP BY p.avatar_id) s0
LEFT JOIN (SELECT avatar_id, IFNULL(SUM(qa_coin_bounty),0) AS qa_lost FROM post po WHERE time_limit_qa>CURDATE() GROUP BY avatar_id) s1
on s0.avatar_id = s1.avatar_id) left join (select p.post_id as post_id, p.avatar_id as giver_id, po.avatar_id as receiver_id, po.post_id as answer_id, p.qa_coin_bounty as qacoin
from post p join post po on p.post_id = po.question_id where p.time_limit_qa>=NOW() and p.qa_coin_bounty>0 and po.thoughtfulness_score>=2
and po.timestamp < p.time_limit_qa order by  po.thoughtfulness_score desc limit 1) s3 on s0.avatar_id = s3.receiver_id
left join (select p.post_id as post_id, p.avatar_id as giver_id, po.avatar_id as receiver_id, po.post_id as answer_id, p.qa_coin_bounty as qacoin
from post p join post po on p.post_id = po.question_id where p.time_limit_qa>=NOW() and p.qa_coin_bounty>0 and po.thoughtfulness_score>=2
and po.timestamp < p.time_limit_qa order by  po.thoughtfulness_score desc limit 1) s4 on s0.avatar_id = s4.giver_id
 ORDER BY thoughfulness DESC"""

upsertChatId_sql = """UPDATE avatar SET chat_id='{}' where telegram_account='{}'"""

insertTraining_sql = """insert into training (post_id, Mark, q_or_a) VALUES ({}, {}, (select is_question from post where post_id={}))"""

updateTraining_sql = """UPDATE training tr
       JOIN thoughtfulness_score t
       ON tr.post_id = t.post_id
SET 
tr.average_number_of_characters_per_word = t.average_number_of_characters_per_word,
tr.average_number_of_words_per_sentence = t.average_number_of_words_per_sentence,
tr.number_of_words = t.number_of_words,
tr.discourse_relations_score = t.discourse_relations_score,
tr.formula_count = t.formula_count,
tr.average_noun_phrases_per_sentence = t.average_noun_phrases_per_sentence,
tr.average_verb_phrases_per_sentence = t.average_verb_phrases_per_sentence,
tr.average_pronouns_phrases_per_sentence = t.average_pronouns_phrases_per_sentence,
tr.number_of_links = t.number_of_links,
tr.type_of_question = t.type_of_question,
tr.average_number_of_subordinate_clauses_per_sentence = t.average_number_of_subordinate_clauses_per_sentence where tr.post_id={}"""

allPost = "select * from post where post_id={}"


survey_sql = """INSERT INTO survey (avatar_id, Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8)
                            VALUES ((SELECT avatar_id from avatar where chat_id={}),
                             {}, {}, {}, {}, {}, {}, '{}', '{}')"""

survey_chat_sql = "select chat_id from avatar where avatar_id in (select avatar_id from survey)"

vote_sql = """INSERT INTO vote (post_id, avatar_id, timestamp, vote) VALUES ({}, {}, '{}', {})
            ON DUPLICATE KEY UPDATE timestamp='{}', vote={}"""

getSessions_sql = """select section_id from ((select avatar_id, section_id from avatar) 
                    union (select avatar_id, section as section_id from a_section) ) 
                     as T where avatar_id ={}"""

getPostsBySection_sql = """SELECT post_id as 'key', post_subject as subject, 
                qa_coin_bounty as qacoins, timestamp as date, 
                (select count(*) from post	where question_id = p.post_id) as commentCounts,
                (select count(*) from post where (isnull(reviewed) or reviewed=0) and 
                (post_id=p.post_id or question_id=p.post_id)) as reviewCounts,
                avatar_name as username FROM post p, avatar a 
                WHERE is_question = 1 and p.avatar_id = a.avatar_id and 
                (section_id='{}')
                ORDER BY `timestamp` DESC"""

getPostsByTopicSection_sql = """SELECT post_id as 'key', post_subject as subject, 
                qa_coin_bounty as qacoins, timestamp as date, 
                (select count(*) from post	where question_id = p.post_id) as commentCounts,
                (select count(*) from post where (isnull(reviewed) or reviewed=0) and 
                (post_id=p.post_id or question_id=p.post_id)) as reviewCounts,
                avatar_name as username FROM post p, avatar a 
                WHERE is_question = 1 and p.avatar_id = a.avatar_id and post_id in (select post_id from post_tag where tag_id in (select tag_id from 
                tag_topic where topic_id ={}) and association > {}) and 
                (section_id='{}')
                ORDER BY `timestamp` DESC"""
