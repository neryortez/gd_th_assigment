

export interface ProcessorFileConfig {
    file: string;
}

export interface ProcessorUrlConfig {
    url: string;
}
export interface ProcessorConfigData {
    /** Default: ', ' */
    delimeter?: string;
    skipHeader?: boolean;
}

export type ProcessorConfig = (ProcessorFileConfig | ProcessorUrlConfig) & ProcessorConfigData;
