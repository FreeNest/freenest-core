from helper.oscommands import OSCommands
import os 
import sys
import shutil
import settings

MODULE_NAME="preinstall"

def install(config):
    reset_log_dir()
    remove_working_dir()
    default_to_working(config)

def default_to_working(config):
    try:
        if config.has_option("general","dblfile"):
            osc = OSCommands(MODULE_NAME)
            osc.cmdlog("tar -xf "+settings.DBL_TAR_DIR+"/"+config.get("general","dblfile"))
            shutil.copytree(settings.DBL_FILES_DIR, settings.WORKING_DIR)
            osc.cmdlog("rm -r "+settings.NESTCONTROL_PATH+"/tmp")
        else:
            shutil.copytree(settings.DEFAULT_FILES_DIR, settings.WORKING_DIR)
    except IOError:
        sys.stderr.write("Could not copy default files")
        sys.exit(1)

def remove_working_dir():
    shutil.rmtree(settings.WORKING_DIR, True)

def reset_log_dir():
    if os.path.exists(settings.LOG_DIR):
        shutil.rmtree(settings.LOG_DIR, True)
    os.mkdir(settings.LOG_DIR)

def ask_options(config):
    pass
