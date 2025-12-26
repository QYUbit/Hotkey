import path from "path";
import regedit from "regedit";

export function addToAutostart(cb: (err?: Error | null) => void) {
    const autostartKey = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
    const appName = "Hotkey Background";
    const exePath = path.join(process.resourcesPath, "hotkey_background.exe");

    regedit.putValue({
        [autostartKey]: {
            [appName]: {
                value: `"${exePath}"`,
                type: "REG_SZ"
            }
        }
    }, cb);
};
