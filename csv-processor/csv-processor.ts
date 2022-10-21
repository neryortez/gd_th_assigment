import { ProcessorConfig } from "./interfaces/processor-config.interface";
import { Transformer } from "./interfaces/transformer.interface";
import { AfterFileProcessedHook } from "./interfaces/after-file-processed-hook.interface";
import { CSVParser } from "./utils/csv-parser";
import { fetchUrlRawString } from "./utils/fetch-file";
import { getStringFromFile } from "./utils/get-string-from-file";

export class CSVProcessor<T = string[]> {

    private transformers: Transformer<any, any>[] = [];
    private afterProcessedHook?: AfterFileProcessedHook<T>;
    private beforeProcessHook?: (data: string[][]) => void;
  
    constructor(private config: ProcessorConfig) {
        if (!config) {
            throw new Error("A config has to be specified");
        }
    }

    /**
     * Adds a hook that is going to be executed before the file is read.
     * Changes to the provided raw data doesn't affect the rows processed in the transformers
     * @param hook Hook that accepts the raw rows. 
     */
    addBeforeProcessHook(hook: (data: string[][]) => void) {
        this.beforeProcessHook = hook;
        return this;
    }
    
    addTransformer<R>(transformerFn: Transformer<T, R>): CSVProcessor<R> {
        this.transformers.push(transformerFn);
        return this as unknown as CSVProcessor<R>;
    }

    addAfterProcessed(hook: AfterFileProcessedHook<T>) {
        this.afterProcessedHook = hook;
        return this;
    }

    async process() {
        let rawStrings = await this.getRawData();

        let rows = CSVParser(rawStrings, this.config.delimeter || ', ');

        if (this.beforeProcessHook) {
            this.beforeProcessHook(rows);
        }

        if (this.config.skipHeader) {
            rows = rows.splice(1);
        }

        rows = this.transformers.reduce((prev, curr) => {
            return prev.map(row => {
                return curr(row);
            });
        }, rows);

        if(this.afterProcessedHook) {
            this.afterProcessedHook(rows as any[]);
        }

        return rows;
    }
  

    private getRawData() { 
        if ('url' in this.config) {
            return fetchUrlRawString(this.config.url);
        } else {
            return getStringFromFile(this.config.file);
        }
    }
}