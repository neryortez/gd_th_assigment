Description
=
This is the solution to the NodeJS challenge by Encora.


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