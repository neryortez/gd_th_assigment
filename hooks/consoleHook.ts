export function consoleHook<T>(rows: T[]) {
    rows.forEach(d => console.log(d));
}
