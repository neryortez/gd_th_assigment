export function parseNumbers(row: string[]) {
    return row.map(field => {
        const n = Number(field);
        return isNaN(n) ? field : n;
    });
}
