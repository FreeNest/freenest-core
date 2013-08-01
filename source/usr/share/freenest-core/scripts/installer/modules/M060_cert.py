import helper.config
from helper.oscommands import OSCommands
import os
import time

MODULE_NAME="cert"

def install(config):
    hostname = config.get("network", "hostname")
    domain = config.get("network", "domain")
    osc = OSCommands(MODULE_NAME)

    # Generate CA
    osc.cmdlog("openssl genrsa -out /etc/ssl/private/server.key")

    # Generate SSL certs
    # OLDVSNEW: Removed empty C, ST and L subj parameters
    command = "openssl req -new -key /etc/ssl/private/server.key "
    command += "-out /tmp/server.csr "
    command += '-subj \"/O=FreeNEST/CN='
    command += hostname + '.' + domain + '\"'
    osc.cmdlog(command)

    command = "openssl x509 -req -in /tmp/server.csr "
    command += "-signkey /etc/ssl/private/server.key "
    command += "-out /etc/ssl/certs/server.crt"
    osc.cmdlog(command)

    # Remove unnecessary files
    if os.path.exists( "/tmp/server.csr" ):
        os.remove("/tmp/server.csr")

def ask_options(config):
    pass
