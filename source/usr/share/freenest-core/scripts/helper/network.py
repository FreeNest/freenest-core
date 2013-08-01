from helper.oscommands import OSCommands

def ip_addr(interface="eth0"):
    """Obtain the external IP address of the machine, default interface eth0"""
    osc = OSCommands("network")
    ipaddress = osc.cmdoutput(
        "ifconfig | grep " + interface + " -A5 | grep -w inet"
        + "| awk 'BEGIN {FS = \" \"}; {print $2}' "
        + "| awk 'BEGIN { FS = \":\"}; {print $2}'")
    return ipaddress[0].rstrip()
