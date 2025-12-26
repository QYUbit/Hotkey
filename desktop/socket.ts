import net from "net";
import { Hotkey } from "./shared";

const HOST = "localhost";
const PORT = 60006;

const socket: net.Socket = new net.Socket();

function ensureSocket() {
    if (socket.closed) {
        socket.connect(PORT, HOST)
    }
}

export function closeSocket() {
    socket.destroy();
}

export function socketSetHotkey(hotkey: Hotkey, cb?: (err?: Error | null) => void) {
    ensureSocket();
    
    const message = {
        method: "setHotkey",
        hotkey: hotkey
    };

    socket.write(JSON.stringify(message), cb);
}

export function socketRemoveHotkey(hotkey: Hotkey, cb?: (err?: Error | null) => void) {
    ensureSocket();
    
    const message = {
        method: "removeHotkey",
        hotkey: hotkey
    };

    socket.write(JSON.stringify(message), cb);
}
