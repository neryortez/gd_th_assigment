export function CSVParser(input: string, delimeter: string): string[][] {
    return input.split('\n')
        .map(r => r.split(delimeter))
}