import { consoleHook } from "./hooks/consoleHook";
import { CSVProcessor } from "./csv-processor/csv-processor";
import { getFirstNumber } from "./transformers/getFirstNumber";
import { numberConverter } from "./transformers/numberConverter";
import { parseNumbers } from "./transformers/parseNumbers";
import { powerOf } from "./transformers/powerOf";

async function main() {
    console.log(" ==== [Power of 3 of extracted numbers in a CSV file] =====");
    await new CSVProcessor({
        file: './assets/test.csv',
        // skipHeader: true,
    })
        .addTransformer(getFirstNumber)
        .addTransformer(powerOf(3))
        .addAfterProcessed(consoleHook)
        .process();


    console.log(" ==== [Square of numbers in a CSV file] =====");
    await new CSVProcessor<string>({
        file: './assets/numbers.csv',
        skipHeader: true,
    })
        .addTransformer(numberConverter)
        .addTransformer(powerOf(2))
        .addAfterProcessed(consoleHook)
        .process();

    
    console.log(" ==== [Power of 2 of extracted numbers in a CSV file] =====");
    await new CSVProcessor<string[]>({
        file: './assets/test.csv',
        // skipHeader: true,
    })
        .addTransformer(getFirstNumber)
        .addTransformer(powerOf(2))
        .addAfterProcessed(consoleHook)
        .process();


    console.log(" ==== [Get remote CSV file and parse numbers] =====");
    await new CSVProcessor({
        url: 'https://people.sc.fsu.edu/~jburkardt/data/csv/addresses.csv',
        delimeter: ','
    })
        .addTransformer(parseNumbers)
        .addAfterProcessed(consoleHook)
        .process();
}

main();