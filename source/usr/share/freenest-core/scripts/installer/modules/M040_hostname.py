import shutil
import settings
import debconf
from helper.oscommands import OSCommands
from helper.network import ip_addr

MODULE_NAME="hostname"

def install(config):
    osc = OSCommands(MODULE_NAME)
    hostname = config.get("network", "hostname")
    domain = config.get("network", "domain")
    admin_email = config.get("ldap","freenest_adminuser_email")
    ipaddress = ip_addr()

    #Change current hostname
    address = hostname + "." + domain
    osc.cmdlog("hostname " + hostname)
    osc.cmdlog("rpl -q Domain_PLACEHOLDER "
        + domain +" "+settings.WORKING_DIR+"/hosts")
    osc.cmdlog("rpl -q HostName_PLACEHOLDER "
        + hostname + " " +settings.WORKING_DIR+"/hosts")
    osc.cmdlog("rpl -q HostName_PLACEHOLDER "
        + hostname + " " +settings.WORKING_DIR+"/hostname")
    osc.cmdlog("rpl -q IPADDRESS_PLACEHOLDER "
        + ipaddress + " " +settings.WORKING_DIR+"/hosts")

    shutil.copyfile(settings.WORKING_DIR+"/hosts", "/etc/hosts")
    shutil.copyfile(settings.WORKING_DIR+"/hostname", "/etc/hostname")
    osc.cmdlog("/etc/init.d/hostname start")
    # 24.07.2012 These commands are probably unnecessary. Delete these lines if there has not been any bugs related to these commands.
    #    # Shutdown supybot
    #    osc.cmdlog("killall supybot")
    #
    #    # Update hostname and domain to /etc
    #    osc.recursive_rpl(settings.DEFAULT_ADMIN_EMAIL, admin_email, "/etc")
    #    osc.recursive_rpl(settings.DEFAULT_HOSTNAME, hostname, "/etc")
    #    osc.recursive_rpl(settings.DEFAULT_DOMAIN, domain, "/etc")
    #
    #    # Update hostname and domain to /var/www
    #    osc.recursive_rpl(settings.DEFAULT_ADMIN_EMAIL, admin_email, "/var/www")
    #    osc.recursive_rpl(settings.DEFAULT_HOSTNAME, hostname, "/var/www")
    #    osc.recursive_rpl(settings.DEFAULT_DOMAIN, domain, "/var/www")
    #
    #    # Update hostname and domain to /var/lib
    #    osc.recursive_rpl(settings.DEFAULT_ADMIN_EMAIL, admin_email, "/var/lib")
    #    osc.recursive_rpl(settings.DEFAULT_HOSTNAME, hostname, "/var/lib")
    #    osc.recursive_rpl(settings.DEFAULT_DOMAIN, domain, "/var/lib")
    #
    #
    #    # Shutdown supybot
    #    osc.cmdlog("killall supybot")
    #
    #    osc.cmdlog("rpl -q Domain_PLACEHOLDER "
    #        + domain +" /home/nestbot/FreeNestBot.conf")
    #    osc.cmdlog("rpl -q HostName_PLACEHOLDER "
    #        + hostname +" /home/nestbot/FreeNestBot.conf")
    #    osc.cmdlog("rpl -q IPADDRESS_PLACEHOLDER "
    #        + ipaddress + " /home/nestbot/FreeNestBot.conf")
    #
    #
    #    # Update NestBot configs
    #    osc.recursive_rpl(settings.DEFAULT_ADMIN_EMAIL, admin_email, "/home/nestbot")
    #    osc.recursive_rpl(settings.DEFAULT_HOSTNAME, hostname, "/home/nestbot")
    #    osc.recursive_rpl(settings.DEFAULT_DOMAIN, domain, "/home/nestbot")
    #
    #    # update /usr/local/nest_tools
    #    osc.recursive_rpl(settings.DEFAULT_ADMIN_EMAIL, admin_email, "/usr/local/nest_tools")
    #    osc.recursive_rpl(settings.DEFAULT_HOSTNAME, hostname, "/usr/local/nest_tools")
    #    osc.recursive_rpl(settings.DEFAULT_DOMAIN, domain, "/usr/local/nest_tools")
    
    # update /usr/local/nest_tools
    #    osc.recursive_rpl(settings.DEFAULT_HOSTNAME, hostname, "/usr/local/nest_tools")
    #    osc.recursive_rpl(settings.DEFAULT_DOMAIN, domain, "/usr/local/nest_tools")
    
    #Change current hostname
    #address = hostname + "." + domain
    #osc.cmdlog("hostname " + hostname)
    #osc.cmdlog("rpl -q HostName_PLACEHOLDER.Domain_PLACEHOLDER "
    #    + address +" "+settings.WORKING_DIR+"/hosts")
    #osc.cmdlog("rpl -q HostName_PLACEHOLDER "
    #    + hostname + " " +settings.WORKING_DIR+"/hosts")
    #osc.cmdlog("rpl -q IPADDRESS_PLACEHOLDER "
    #    + ipaddress + " " +settings.WORKING_DIR+"/hosts")

    #shutil.copyfile(settings.WORKING_DIR+"/hosts", "/etc/hosts")

def ask_options(config):
    pass
