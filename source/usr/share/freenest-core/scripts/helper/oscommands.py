import os
import subprocess
from distutils import dir_util
from subprocess import CalledProcessError, Popen
import string
import random
import settings 

INSTALLER_DIR = os.path.realpath(__file__)

class OSCommands:
    def __init__(self, filename):
        self.filename = filename 
        self.logfd = self.open_log( self.filename ) 
            
    def get_filename(self):
        return self.filename

    # define a property setter for filename in case we need to change the 
    # filename on the fly. 
    def set_filename(self, newfilename):
        if self.logfd != None:
            self.logfd.close()

        self.filename = newfilename
        self.logfd = self.open_log( self.filename )

    # Execute a command and save it's output to self.logfd
    def cmdlog(self, *args):
        wd = os.getcwd()
        p = Popen(args, stdout=self.logfd, stderr=subprocess.STDOUT, \
            shell=True,cwd=wd)
        exitcode = p.wait()

        return exitcode

    # Execute a command returns it's output. stderr is redirected to self.logfd
    def cmdoutput(self, *args):
        try:
            wd = os.getcwd()
            cmd = Popen(args, stdout=subprocess.PIPE, stderr=self.logfd, \
                shell=True, cwd=wd)
            out = cmd.communicate()
            return out
        except CalledProcessError, e:
            raise OSError(str(e))
        except IOError, e:
            raise e

    def open_log(self, filename):
        dir_util.mkpath(settings.LOG_DIR)
        return open(settings.LOG_DIR + self.filename+".log", "a+")

    def generate_password(self, length):
        chars = string.letters + string.digits
        newpasswd = ''
        for i in range(length):
            newpasswd = newpasswd + random.choice(chars)
        return newpasswd

    def recursive_rpl( self, old, new, path ):
        self.cmdlog("rpl -R -q '" + old + "' '" + new + "' " + path)

    def rpl( self, old, new, myfile ):
        self.cmdlog("rpl -q '" + old + "' '" + new + "' " + myfile )

