from helper.oscommands import OSCommands
import helper.config
import settings

MODULE_NAME="logscripts"

_RPL_DOMAIN = "Domain_PLACEHOLDER"
_RPL_HOST = "HostName_PLACEHOLDER"

def install(config):
    osc = OSCommands(MODULE_NAME)

    hostname = config.get("network", "hostname")
    domain = config.get("network", "domain")

    # Replace domain name with the configured one
    osc.cmdlog( "rpl -q -R " + _RPL_DOMAIN + " " + domain
        + " " + settings.WORKING_DIR + "/logscripts")

    # Replace the more common hostname with the configured one
    osc.cmdlog("rpl -q -R " + _RPL_HOST + " " + hostname
        + " " + settings.WORKING_DIR + "/logscripts")

    # Copy the updated files
    osc.cmdlog("cp -r " + settings.WORKING_DIR + "/logscripts /nestcontrol/logscripts")

def ask_options(config):
    pass
