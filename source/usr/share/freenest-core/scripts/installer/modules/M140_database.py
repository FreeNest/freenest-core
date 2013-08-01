from helper.oscommands import OSCommands
import os
import helper.config
import shutil
import settings
import hashlib
import getpass

MODULE_NAME="database"

def install(config):
    osc = OSCommands(MODULE_NAME)

    mysqlpass = config.get("database", "mysql_passwd")
    mysqluname = config.get("database", "mysql_uname")
    osc.recursive_rpl("MYSQL_ADMINUSER_PASSWD", mysqlpass, "/usr/share/freenest-core/www")
    osc.recursive_rpl("MYSQL_UNAME", mysqluname, "/usr/share/freenest-core/www")

def ask_options(config):
    pass
