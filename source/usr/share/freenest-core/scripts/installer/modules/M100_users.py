import os
import sys
import crypt
import shutil
import string
import settings
import helper.config
from helper.oscommands import OSCommands

MODULE_NAME="users"
ENCRYPTION_SCHEME="{MD5}"


def install(config):
    create_adminuser(config)
    create_rss_user(config)

def create_adminuser(config):
    "Creates the adminuser unix user and sets its password"

    osc = OSCommands(MODULE_NAME)
    #adminuser_pass = config.get("general", "adminuser_password")

    #osc.cmdlog("chpasswd < " + settings.ADMIN_NAME + ":" + adminuser_pass)

def crypted_password(password, scheme):
    "Returns a crypted openldap password using the supplied encryption scheme"

    osc = OSCommands(MODULE_NAME)
    return osc.cmdoutput("slappasswd -v -s "
        + password 
        + " -h " 
        + scheme)

def create_rss_user(config):
    "Creates an RSS aggregator unix user and sets its ldap password"

    osc = OSCommands(MODULE_NAME)
    # RSS user
    rsspass = osc.generate_password(64)

    try:
        rssfile = open(settings.WORKING_DIR+"/rsspass", "w")
        rssfile.write(rsspass)
        rssfile.close()
        os.chmod(settings.WORKING_DIR+"/rsspass", 0700)
    except IOError:
        sys.stderr.write("Could not write RSS user password to a file")
        return

    #Pasi goddammit, unix dirs in lowercase
    osc.cmdlog( "useradd rssuser -m -d /home/RssUser -p " + rsspass)

    osc.rpl("userpassword: RssUser", 
            "userpassword: "+rsspass, 
            settings.WORKING_DIR+"/nest_users.ldif")

def ask_options(config):
    pass
