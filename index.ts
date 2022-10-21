import { consoleHook } from "./hooks/consoleHook";
import { CSVProcessor } from "./csv-processor/csv-processor";
import { getFirstNumber } from "./transformers/getFirstNumber";
import { numberConverter } from "./transformers/numberConverter";
import { parseNumbers } from "./transformers/parseNumbers";
import { powerOf } from "./transformers/powerOf";
import { getHeaders } from "./hooks/get-headers.before-hook";

async function main() {
    console.log(" ==== [Power of 3 of extracted numbers in a CSV file] =====");
    await new CSVProcessor({
        file: './assets/test.csv',
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

    console.log(" ==== [Convert the rows in objects with the header] =====");
    await new CSVProcessor<string>({
        file: './assets/numbers.csv'
    })
        .addBeforeProcessHook(getHeaders)
        .addAfterProcessed(consoleHook)
        .process();

    console.log(" ==== [Get remote CSV file and parse numbers] =====");
    await new CSVProcessor({
        url: 'https://raw.githubusercontent.com/neryortez/gd_th_assigment/master/assets/test.csv',
        delimeter: ','
    })
        .addTransformer(parseNumbers)
        .addAfterProcessed(consoleHook)
        .process();
}

main();