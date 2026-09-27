Your task is to write a test for the following function
```
zod.z.nativeEnum(entries, params)
```

You may use the following examples to guide your implementation:
```
// usage #1
enum Fruits {  Apple,  Banana,}const FruitEnum = z.nativeEnum(Fruits);type FruitEnum = z.infer<typeof FruitEnum>; // FruitsFruitEnum.parse(Fruits.Apple); // passesFruitEnum.parse(Fruits.Banana); // passesFruitEnum.parse(0); // passesFruitEnum.parse(1); // passesFruitEnum.parse(3); // fails
// usage #2
enum Fruits {  Apple = "apple",  Banana = "banana",  Cantaloupe, // you can mix numerical and string enums}const FruitEnum = z.nativeEnum(Fruits);type FruitEnum = z.infer<typeof FruitEnum>; // FruitsFruitEnum.parse(Fruits.Apple); // passesFruitEnum.parse(Fruits.Cantaloupe); // passesFruitEnum.parse("apple"); // passesFruitEnum.parse("banana"); // passesFruitEnum.parse(0); // passesFruitEnum.parse("Cantaloupe"); // fails
// usage #3
const Fruits = {  Apple: "apple",  Banana: "banana",  Cantaloupe: 3,} as const;const FruitEnum = z.nativeEnum(Fruits);type FruitEnum = z.infer<typeof FruitEnum>; // "apple" | "banana" | 3FruitEnum.parse("apple"); // passesFruitEnum.parse("banana"); // passesFruitEnum.parse(3); // passesFruitEnum.parse("Cantaloupe"); // fails
```

Please proceed by modifying the following code fragment
```
let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');
describe('test zod', function() {
    it('test zod.z.nativeEnum', function(done) {
``` 
so that it becomes a single, self-contained unit test.  The test should not rely on any external resources. 
For example, it should not attempt to access files that it does not create itself.
Keep the three `require` lines exactly as given and make them the first three lines of your code block; do not put a comment, a file name, or anything else before them. Write exactly one `it` block.

Provide your answer as a fenced code block 
```
<unit test>
```