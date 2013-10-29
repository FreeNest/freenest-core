import optparse
import debconf
import os
import sys
import settings
from helper.config import Config
from helper.moduleutil import modules
from helper.network import ip_addr

_INSTALLER_MODULEDIR_PATH = settings.INSTALLER_PATH + "/modules"
_INSTALLER_MODULE_PATH =  "installer.modules"

def run(argv):
    args = argv #check_args(argv)
     
    check_superuser()
    #check_installer_ran(args)

    installermodules = modules(_INSTALLER_MODULEDIR_PATH, _INSTALLER_MODULE_PATH)
    conf = load_config(args, installermodules)
    if not conf:
        sys.stderr.write("Could not load config file")
        sys.exit(1)

    install(conf, installermodules)

    save_config(conf)
    set_status_installed()
    splash_ending()

def load_config(args, installermodules):
    """
    Puts the settings user has given via debconf to conf object
    """
    conf = Config()
    for i in args:
	#print(i)
	section, option, value = i.split(";")
	conf.set_value(section, option, value)
    return conf

def read_config(config_path):
    """
    Reads a config file and returns a Config instance
    """
    config = Config()
    config.read(config_path)
    return config

def check_superuser():
    """Check to see if the script is run as a superuser"""
    if os.getuid() != 0:
        sys.stderr.write("Please run the script as a superuser "
            + "(eg. 'sudo python installer.py')\n")
        sys.exit(1)

def check_installer_ran(args):
    """Check to see if the installer has already been ran"""
    if os.path.exists(".installed") and not args.force:
        sys.stderr.write("Installer has already been executed\n")
        sys.exit(1)

def check_args(args):
    """
    Parses and checks the arguments given to the installer.
    Returns options instance
    """
    usage = "nestcontrol install [options]"
    parser = optparse.OptionParser(usage = usage)
    parser.add_option('-c', '--configfile', action="store", default=None,
        dest="configfile", type="string",
        help="A file that contains all answers to the questions asked by the "
        +"installer, so the installer doesn't have to ask the user anything."
        +"Used for automation.")
    parser.add_option('-f', '--force', action="store_true", default=False,
        dest="force",
        help="Force the installation to start even if it has been executed "
            + "already")
    parser.add_option('-k', '--keep-working-dir', action="store_true", 
        default="False", dest="keep_working_dir", 
        help="Do not remove working dir after installation is complete")
    parser.add_option('-d', '--databaseline', action="store", default=None,
        dest="dblfile", type="string",
        help="Databaseline that contains files that override default files "
            + "for installer.")

    args = parser.parse_args(args)[0]

    return args

def check_networking():
    """
    Shows the user their IP address and prompts them 
    if they want to continue the installation
    """
    ipaddress = ip_addr()

    sys.stdout.write("Please verify your network settings before continuing.\n"
                    "You will need a working internet connection for the \n"
                    "installer to work. Remember to make sure that you can \n"
                    "access this IP address from other machines as well.\n"
                    "Your IP address is: "+ipaddress+" .\n")

    #choice = raw_input("Do you want to continue? [y/n]: ")
    
    #while choice != "n" and choice != "y":
    #    choice = raw_input("Do you want to continue? [y/n]: ")

    #if choice == "n":
    #    sys.exit(1)

def ask_options(modules):
    """
    Prompts the user for configuration options inside specified modules
    and returns the configuration
    """
    config = Config()
    for module in modules:
        module.ask_options(config)
    return config

def install(config, modules):
    """
    Runs the install function for all modules, gives the config as parameter
    """
    for module in modules:
        sys.stdout.write("  Configuring: " + module.MODULE_NAME + "... ")
        sys.stdout.flush()
        module.install(config)
        sys.stdout.write("done!\n")

def splash_ending():
    """
    Shows the user their IP address and a notification that the installer
    has finished
    """
    ipaddress = ip_addr()

    sys.stdout.write("  You can access your FreeNest installation by navigating to "
        + ipaddress + "\n")

def save_config(conf):
    """
    Saves the config file
    """
    conf_file = open(settings.CONFIG_FILE ,"w")
    conf.write(conf_file)

def set_status_installed():
    """
    Creates an .installed file to mark that the installer has been run once
    """
    fd = open(settings.INSTALLER_PATH+"/.installed", "w") 
    fd.close()
