export function getOne<T>(indexToKeep: number) {
    return (input: T[]) => input[indexToKeep];
}
