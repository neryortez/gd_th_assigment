import fs from "fs/promises";

export function getStringFromFile(path: string) {
    return fs.open(path)
        .then(f => f.readFile())
        .then(b => b.toString());
}