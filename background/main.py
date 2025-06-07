import os
import json
from socket_server import run_socket_server
from hotkeys import register_hotkey

FILE_PATH = os.path.join(os.getenv("APPDATA"), "hotkey", "data.json") # type: ignore (we can't use a literal string here)

def load_file():
    with open(FILE_PATH, "r", encoding="utf-8") as file:
        return json.load(file)

def main():
    data = load_file()

    if data["hotkeys"]: 
        for hotkey in data["hotkeys"]:
            register_hotkey(hotkey)
    else:
        print("invalid data file format: missing hotkeys field")

    try:
        run_socket_server()
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()
