import MySQLdb
from datetime import datetime
import string
from config import config
from config import sql
import MySQLdb.cursors

class Forum:
    def __init__(self):
        self.con = MySQLdb.connect(host=config.db_host,   
                                        port=config.db_port,
                                        user=config.db_username,         
                                        passwd=config.db_password,  
                                        db=config.db_schema,
                                        cursorclass=MySQLdb.cursors.DictCursor)
        self.cur = None

    def _init_con(self):
        if self.con == None:
            self.con = MySQLdb.connect(host=config.db_host,   
                                    port=config.db_port,   
                                    user=config.db_username,         
                                    passwd=config.db_password,  
                                    db=config.db_schema,
                                    cursorclass=MySQLdb.cursors.DictCursor)
        if self.cur == None:
            self.cur = self.con.cursor()

    def _date(self):
        return str(datetime.now()).split(" ")[0]

    def _time(self):
        return str(str(datetime.now()).split(" ")[1]).split(".")[0]

    def _result_dict(self, cursor):
        result = []
        for row in cursor:
            result.append(dict(row))
        return result

    def _safe(self, input):
        input = string.replace(input, "'", "\\'")
        input = string.replace(input, '"', '\\"')
        input = string.replace(input, ";", "\\;")
        input = string.replace(input, "%", "\\%")
        input = string.replace(input, "_", "\\_")
        return input

    def _close(self):
        self.cur.close()
        self.cur = None
        self.con = None
