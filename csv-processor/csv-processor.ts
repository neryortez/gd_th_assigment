import fetch from "node-fetch";
import fs from "fs/promises";
  

export interface ProcessorFileConfig {
    file: string,
}

export interface ProcessorUrlConfig {
    url: string;
}

interface ProcessorConfigData {
    /** Default: ', ' */
    delimeter?: string;
    skipHeader?: boolean;
}

export type ProcessorConfig = (ProcessorFileConfig | ProcessorUrlConfig) & ProcessorConfigData;

export interface Transformer <T, R> { (input: T): R };

export interface AfterFileProcessed<T> { (data: T[]): void }

// type Transformer<T extends any, R extends any> = (input: T) => R;

export type Row<T> = T;



export class CSVProcessor<T = string[]> {

    private transformers: Transformer<any, any>[] = [];
    private afterProcessedHook?: AfterFileProcessed<T>;
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

    addAfterProcessed(hook: AfterFileProcessed<T>) {
        this.afterProcessedHook = hook;
        return this;
    }

    async process() {
        let file;
        if ('url' in this.config) {

            file = await fetch(this.config.url)
                .then(r => r.text());
        } else {
            file = await fs.open(this.config.file)
                .then(f => f.readFile())
                .then(b => b.toString());
        }

        let rows = file.split('\n').map(r => r.split(this.config.delimeter || ', '));

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
  
}