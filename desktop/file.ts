import { app } from "electron";
import path from "path";
import { DataFile, Hotkey, isDataFile } from "./shared.js";
import fs from "node:fs"

const dataFile = path.join(app.getPath("userData"), "data.json");

const dataFileTemplate: DataFile = {
    hotkeys: []
};

export function loadDataFile(cb: (err: Error | null, data?: DataFile) => void) {
    fs.stat(dataFile, (err) => {
        if (err && err.code === 'ENOENT') {
            fs.writeFile(dataFile, JSON.stringify(dataFileTemplate), (err) => {
                if (err) return cb(new Error(`Failed to create data file: ${err.message}`));
            });
            return cb(null, dataFileTemplate);
        } else if (err) {
            return cb(new Error(`Failed to load data file: ${err.message}`));
        }

        fs.readFile(dataFile, {encoding: "utf-8"}, (err, raw) => {
            if (err) return cb(new Error(err.message));

            const data = JSON.parse(raw.toString());
            if (!isDataFile(data)) {
                return cb(new Error("Failed to load data file, invalid contents"));
            }
            cb(null, data);
        });
    });
};

export function addHotkey(hotkey: Hotkey, cb: (err: Error | null) => void) {
    loadDataFile((err, data) => {
        if (err) return cb(err);

        const newD: DataFile = data
        ?{hotkeys: [...data.hotkeys, hotkey]}
        :{hotkeys: [hotkey]};

        fs.writeFile(dataFile, JSON.stringify(newD), {encoding: "utf-8"}, (err) => {
            if (err) {
                return cb(new Error(`Failed updating data file: ${err}`));
            }
            cb(null);
        });
    });
};

export function removeHotkey(hotkey: Hotkey, cb: (err: Error | null) => void) {
    loadDataFile((err, data) => {
        if (err) return cb(err);
        if (!data) return cb(null);

        const newD: DataFile = {hotkeys: data.hotkeys.filter(item => item !== hotkey)};
        fs.writeFile(dataFile, JSON.stringify(newD), {encoding: "utf-8"}, (err) => {
            if (err) {
                return cb(new Error(`Failed updating data file: ${err}`));
            }
            cb(null);
        });
    });
};
