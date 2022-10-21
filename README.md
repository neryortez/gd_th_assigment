Description
=
This is the solution to the NodeJS challenge by Encora.

Functional Requirements
=
| Requirement                                                                              | How to use                                                                                                                                            |
|------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Takes a CSV file destination as an input. The input can be a URL or file on the machine  | Create an instance of `CSVProcessor` class and pass the config argument specifying the path or url                                                    |
| Allows the consumer to pass a transformer function that will run for each row of the CSV | Use the `addTransformer` method to pass a transformer function. You can add more than one transformer.                                                |
| Add ability to run a hook before the file is read.                                       | Use the `addBeforeProcessHook` method to pass a hook that will receive the raw data before the transformations are applied.                           |
| Add ability to run a hook after the file is processed.                                   | Use the `addAfterProcessed` method to pass a hook that will receive the transformed data.                                                             |
| Capture the time it takes for the file to get processed.                                 | The `process` method by default prints the time it took parse the file and run the hooks and transformations. Time to fetch/open the file is ignored. |

A few transformation functions have been provided in the [`transformers`](./transformers) folder. But the consumer can write their own transformation functions following the [`Transformer`](./csv-processor/interfaces/transformer.interface.ts) interface.

How to run the project
=

This project can be run with NodeJS v12+ (v10 doesn't have 'fs/promises')

To install dependecies run 
```
npm install
```

This project is written in Typescript. To run the project use the following script
```
npm run start
```


How it works
=
This project uses the CSVProcessor class that accepts a configuration variable that specifies the source of the file. Either a file path or a Url.

Transformation functions can be added. This functions will run in the same order they were added.

To facilitate the addition of transformers and hooks, the `Builder` pattern is used.

``` ts
await new CSVProcessor({
        url: 'https://people.sc.fsu.edu/~jburkardt/data/csv/addresses.csv',
        delimeter: ','
    })
        .addTransformer(parseNumbers)
        .addAfterProcessed(consoleHook)
        .process();
```

The file would be fetch and processed when the `process` method is called.

When the file finished processing, the `AfterProcessedHook` will be executed with the result of the transformations.

Open source dependencies
=
This project depends on the following:
 - `Typescript` To write strongly typed code and facilitate catch bugs on development
 - `ts-node` To facilitate the execution of the TypeScript code.
 - `node-fetch` It helps fetching resources on the Internet. This way we avoid a lot of boilerplate code.

Pros and Cons
=
Method Chaining
-
The current implementation uses the method chaining pattern to facilitate adding transformers to the CSVProcessor.

Also, it leverages the type-checking from TypeScript to validate the types of the transformations in the chain.

In other words, we can check if "`transformerB`" is compatible with the transformation result of "`transformerA`". For example if `transformerB` expects that each row contains just one element, the compiler will warns us if `transformerA` return a list of more than one element; 

Own implementation of CSV parsing
-
The current implementation parses the CSV string in its own. It is a simple implementation that relays on the transformers to provide functions like mapping and header extractions.
 
Using a open source library like `csv-parser` could provide the developer with more functionality and configurations.