import fetch from "node-fetch";

export function fetchUrlRawString(url: string) {
    return fetch(url)
        .then(r => r.text());
}