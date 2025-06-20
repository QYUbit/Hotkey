const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    send: (channel: string, ...args: any[]) => {
        console.log(`ipc send on channel "${channel}"\n\tdata: ${args.join(', ')}`);

        const validChannels = ["addHotkey", "removeHotkey", "ready"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, ...args);
        }
    },
    receive: (channel: string, func: (...args: any[]) => void) => {
        const validChannels = ["sendInitData", "sendErrorFeedback"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (_: any, ...args: any[]) => func(...args));
        }
    }
});
