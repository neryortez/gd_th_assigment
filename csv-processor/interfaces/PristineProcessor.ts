import { Transformer } from "./transformer.interface";
import { AfterFileProcessedHook } from "./after-file-processed-hook.interface";
import { BeforeHook } from "./before-hook.interface";


export interface ProcessableTransformable<T> {
    process: () => Promise<T[]>;
}

export interface AfterHookableProcessor<T> extends ProcessableTransformable<T> {
    addAfterProcessed: (hook: AfterFileProcessedHook<T>) => ProcessableTransformable<T>;
}

export interface TransformableProcessor<T> extends AfterHookableProcessor<T> {
    addTransformer: <S>(transformer: Transformer<T, S>) => TransformableProcessor<S>;
}

export interface PristineProcessor<T> extends TransformableProcessor<T> {
    addBeforeProcessHook: <R>(hook: BeforeHook<T[], R>) => TransformableProcessor<R>;
}
