import keyboard
from actions import actions_dict

def keys_to_str(keys):
    return "+".join(keys)

def register_hotkey(hotkey):
    keys = keys_to_str(hotkey["keys"])
    keyboard.add_hotkey(keys, actions_dict[hotkey["action"]], (hotkey["data"],))

def unregister_hotkey(hotkey):
    keys = keys_to_str(hotkey["keys"])
    keyboard.unregister_hotkey(keys)
