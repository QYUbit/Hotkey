import { app, BrowserWindow, ipcMain } from "electron";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { addHotkey, loadDataFile, removeHotkey } from "./file.js";
import { isHotkey } from "./shared.js";
import { socketRemoveHotkey, socketSetHotkey } from "./socket.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

let win: BrowserWindow;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1100,
        height: 650,
        title: "Hotykey",
        icon: path.join(__dirname, "assets", "icon.png"),
        autoHideMenuBar: true,
        darkTheme: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
  
    win.loadFile(path.join(__dirname, "render", "index.html"));
};

app.on("ready", () => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.on("ready", () => {
    loadDataFile((err, data) => {
        if (!err) {
            win.webContents.send("sendInitData", data?.hotkeys);
        } else {
            win.webContents.send("sendErrorFeedback");
        }
    });
});

ipcMain.on("addHotkey", (_, hotkey) => {
    if (!isHotkey(hotkey)) {
        win.webContents.send("sendErrorFeedback");
        return;
    }
    addHotkey(hotkey, (err) => {
        if (err) {
            console.error(err);
            win.webContents.send("sendErrorFeedback");
        }
        socketSetHotkey(hotkey, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
});

ipcMain.on("removeHotkey", (_, hotkey) => {
    if (!isHotkey(hotkey)) {
        win.webContents.send("sendErrorFeedback");
        return;
    }
    removeHotkey(hotkey, (err) => {
        if (err) {
            win.webContents.send("sendErrorFeedback");
        }
        socketRemoveHotkey(hotkey, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
});
