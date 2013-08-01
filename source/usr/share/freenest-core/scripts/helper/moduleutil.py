import pkgutil
import sys

def modules(moduledirpath, modulepath):
    """Return a list of all modules in a folder"""
    modulelist = list(pkgutil.iter_modules([moduledirpath]))
    import_modules(modulepath, modulelist)
    names = sorted(module_names(modulelist), key=str.lower)
    modules = []
    for name in names:
        modules.append(sys.modules[modulepath + "." + name])
    return modules

def import_modules(module_path, modules):
    """Import all modules in a folder"""
    for module in modules:
        __import__(module_path + "." + module[1], globals(), locals(), [], -1)

def module_names(modules):
    """Return a list of module names"""
    names = []
    for module in modules:
        names.append(module[1])
    return names
