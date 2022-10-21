export function getHeaders(data: string[][]) {
    const headers = data[0];
    data = data.splice(1);

    return data.map((row) => {
        return row.reduce((prev, curr, currIndex) => {
            prev[headers[currIndex]] = curr;
            return prev;
        }, {} as Record<string, string>)
    });
}