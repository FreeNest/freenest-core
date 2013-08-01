import ConfigParser
import json
import sys

class Config(ConfigParser.ConfigParser):
    """Class for reading and writing configuration options"""

    def prompt_option(self, message, default):
        """Prompts a single option, with the default value"""
        user_input = raw_input(" " + message
            + " (default = \""+ default + "\"): ")

        if len(user_input) == 0:
            return default
        
        return user_input

    def ask_for_option(self, message, section, option, default):
        """Asks a single option from the user, and adds it to the config"""
        value = self.prompt_option(message, default)
        if not self.has_section(section):
            self.add_section(section)
        self.set(section, option, value)

    def set_value(self, section, option, value):
	if not self.has_section(section):
		self.add_section(section)
       	self.set(section, option, value)
