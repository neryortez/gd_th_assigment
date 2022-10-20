export function getFirstNumber(row: string[]): number {
    for (const data of row) {
        const n = Number(data);
        if (!isNaN(n))
            return n;
    }
    return -1;
}
