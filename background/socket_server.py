import socket
import json
from hotkeys import register_hotkey, unregister_hotkey

def handle_client(conn: socket.socket):
    while True:
        data = conn.recv(1024)

        if not data:
            break

        message = json.loads(data.decode())

        if message["method"] == "setHotkey":
            hotkey = message["hotkey"]
            if not hotkey:
                print("invalid socket message: missing hotkey field")
                continue
            # ! Fix this
            try:
                unregister_hotkey(hotkey)
            except:
                pass
            register_hotkey(hotkey)

        elif message["method"] == "removeHotkey":
            hotkey = message["hotkey"]
            if not hotkey:
                print("invalid socket message: missing hotkey field")
                continue
            unregister_hotkey(hotkey)
            
        else:
            print("invalid socket message method")


def run_socket_server():
    SOCKET_HOST = "localhost"
    SOCKET_PORT = 60006

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as socket_server:
        socket_server.bind((SOCKET_HOST, SOCKET_PORT))
        socket_server.listen()

        while True:
            conn, addr = socket_server.accept()
            ip, _ = addr
            if ip in ["127.0.0.1", "::1", "localhost"]:
                handle_client(conn)
            else:
                conn.close()
