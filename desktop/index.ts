import { app, BrowserWindow } from "electron";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1100,
        height: 650,
        title: "Hotykeys",
        icon: path.join(__dirname, "resources/icon.png"),
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
        if(BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") app.quit();
});
