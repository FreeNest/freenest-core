import sys
import settings
from helper.oscommands import OSCommands
import helper.config

MODULE_NAME="ldap"
ENCRYPTION_SCHEME="{MD5}"


def install(config):
    osc = OSCommands(MODULE_NAME)

    # check if slapd is installed and if not install it
#   exitcode = osc.cmdlog("dpkg-query -W -f='${Status}' slapd")

#   if not exitcode:
#       osc.cmdlog("apt-get remove -y --purge slapd ldap-utils")
#       osc.cmdlog("rm -rf /var/lib/ldap")
#       osc.cmdlog("apt-get install -y --force-yes slapd ldap-utils")


    # Set up the LDAP scripts
    ldap_pass = config.get("ldap", "root_password")
    freenest_adminuser_pass = config.get("ldap", "freenest_adminuser_password")
    freenest_adminuser_email = config.get("ldap", "freenest_adminuser_email")
    freenest_rssuser_pass = config.get("ldap", "freenest_rssuser_password")
    sha_pwd = crypted_password(ldap_pass, ENCRYPTION_SCHEME)

    ldap_script_path = settings.WORKING_DIR+"/install-default-ldap.sh"
    osc.rpl( "LDAP_ROOT_USER_NAME", 
            settings.LDAP_ROOT_USER_NAME, 
            ldap_script_path)
    osc.rpl( "LDAP_ADMIN_PASSWORD_HASH", sha_pwd[0], ldap_script_path)
    osc.rpl("LDAP_PATH_TO_TMPDIR", settings.WORKING_DIR, ldap_script_path)

    # Replace adminuser's password and email and also password for rssuser
    ldif_path = settings.WORKING_DIR+"/nest_users.ldif"
    osc.rpl("FREENEST_ADMINUSER_PASSWORD", freenest_adminuser_pass, ldif_path)
    osc.rpl("FREENEST_ADMINUSER_EMAIL", freenest_adminuser_email, ldif_path)
    osc.rpl("FREENEST_RSSUSER_PASSWORD", freenest_rssuser_pass, ldif_path)

    # Execute LDAP initiation script
    osc.cmdlog("cd "+settings.WORKING_DIR+"; sh ./install-default-ldap.sh")

def crypted_password(password, scheme):
    "Returns a crypted openldap password using the supplied encryption scheme"
    osc = OSCommands(MODULE_NAME)

    return osc.cmdoutput("slappasswd -v -s "
        + password
        + " -h "
        + scheme)

def ask_options(config):
    pass
