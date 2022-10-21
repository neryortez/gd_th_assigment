import { ProcessorConfig } from "./interfaces/processor-config.interface";
import { Transformer } from "./interfaces/transformer.interface";
import { AfterFileProcessedHook } from "./interfaces/after-file-processed-hook.interface";
import { CSVParser } from "./utils/csv-parser";
import { fetchUrlRawString } from "./utils/fetch-file";
import { getStringFromFile } from "./utils/get-string-from-file";
import { BeforeHook } from "./interfaces/before-hook.interface";
import { PristineProcessor, ProcessableTransformable, TransformableProcessor } from "./interfaces/PristineProcessor";

export class CSVProcessor<T = string[]> implements PristineProcessor<T> {

    private transformers: Transformer<any, any>[] = [];
    private afterProcessedHook?: AfterFileProcessedHook<T>;
    private beforeProcessHook?: BeforeHook<any, any>;
  
    constructor(private config: ProcessorConfig) {
        if (!config) {
            throw new Error("A config has to be specified");
        }
    }

    /**
     * Adds a hook that is going to be executed before the list of transformers are executed.
     * Can be used to transform the whole data at once before runing the transformers.
     * @param hook Hook that accepts the list of rows. 
     */
    addBeforeProcessHook<R>(hook: BeforeHook<T[], R>) {
        this.beforeProcessHook = hook;
        return this as unknown as TransformableProcessor<R>;
    }
    
    addTransformer<R>(transformerFn: Transformer<T, R>) {
        this.transformers.push(transformerFn);
        return this as unknown as TransformableProcessor<R>;
    }

    addAfterProcessed(hook: AfterFileProcessedHook<T>) {
        this.afterProcessedHook = hook;
        return this as ProcessableTransformable<T>;
    }

    async process(): Promise<T[]> {
        let rawStrings = await this.getRawData();

        const TIME_LABEL = 'CSV processed';
        console.time(TIME_LABEL);

        let rows = CSVParser(rawStrings, this.config.delimeter || ', ');

        if (this.config.skipHeader) {
            rows = rows.splice(1);
        }

        if (this.beforeProcessHook) {
            rows = this.beforeProcessHook(rows);
        }

        const result: T[] = this.transformers.reduce((prev: T[], curr: Transformer<T, T>) => {
            return prev.map(row => {
                return curr(row);
            });
        }, rows as T[]);

        if (this.afterProcessedHook) {
            this.afterProcessedHook(result as any[]);
        }

        console.timeEnd(TIME_LABEL);

        return result;
    }
  

    private getRawData() { 
        if ('url' in this.config) {
            return fetchUrlRawString(this.config.url);
        } else {
            return getStringFromFile(this.config.file);
        }
    }
}