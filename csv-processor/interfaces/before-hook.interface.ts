export interface BeforeHook<T, R> {
    (data: T): R
}