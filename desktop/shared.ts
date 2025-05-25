export interface Hotkey {
    keys: string[];
    actionType: string;
    data: string;
}

export function isHotkey(arg: any): arg is Hotkey {
    return arg.keys && arg.actionType && arg.data
    && arg.keys instanceof Array
    && arg.keys.every((item: any) => typeof item === "string")
    && typeof arg.actionType === "string"
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
