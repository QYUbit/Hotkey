export interface Hotkey {
    keys: string[];
    action: string;
    data: string;
}

export function isHotkey(arg: any): arg is Hotkey {
    return arg.keys && arg.action && arg.data
    && arg.keys instanceof Array
    && arg.keys.every((item: any) => typeof item === "string")
    && typeof arg.action === "string"
    && typeof arg.data === "string"
}

export interface DataFile {
    hotkeys: Hotkey[];
}

export function isDataFile(arg: any): arg is DataFile {
    return arg.hotkeys
    && arg.hotkeys instanceof Array
    && arg.hotkeys.every((item: any) => isHotkey(item))
}
