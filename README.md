Description
=
This is the solution to the NodeJS challenge by Encora.

Functional Requirements
=
| Requirement                                                                             | How to use |
|-----------------------------------------------------------------------------------------|------------|
| Takes a CSV file destination as an input. The input can be a URL or file on the machine |            |
| Allows the consumer to pass a transformer function that will run for each row of        |            |


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