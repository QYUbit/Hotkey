import { exec } from "node:child_process";
import fs from "node:fs";
import * as esbuild from "esbuild";
import path from "node:path";

const srcPath = "./desktop";
const distPath = "./desktop_dist";

fs.rmSync(distPath, {recursive: true, force: true});
fs.mkdirSync(distPath);

fs.cpSync(srcPath, distPath, {recursive: true});

exec("tsc", (err) => {
    (err && err.killed) && console.error(err);
});

exec(
    `npx @tailwindcss/cli -i ${path.join(distPath, "render", "global.css")} -o ${path.join(distPath, "render", "bundle.min.css")} --minify`,
    err => err && console.error(err)
);

esbuild.buildSync({
    bundle: true,
    minify: true,
    entryPoints: ["./" + path.join(distPath, "render", "render.js")],
    outfile: "./" + path.join(distPath, "render", "bundle.min.js"),
});
