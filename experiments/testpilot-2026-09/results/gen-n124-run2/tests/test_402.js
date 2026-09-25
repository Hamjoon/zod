let mocha = require('mocha');
let assert = require('assert');
let zod = require('zod');

describe('test zod', function() {
    it('test zod.z.literal', function(done) {
        // String literal
        const helloLiteral = zod.literal("hello");
        assert.strictEqual(helloLiteral.safeParse("hello").success, true, 'String literal should accept exact match');
        assert.strictEqual(helloLiteral.safeParse("world").success, false, 'String literal should reject different string');

        // Number literal
        const numberLiteral = zod.literal(42);
        assert.strictEqual(numberLiteral.safeParse(42).success, true, 'Number literal should accept exact match');
        assert.strictEqual(numberLiteral.safeParse(43).success, false, 'Number literal should reject different number');

        // Boolean literal
        const trueLiteral = zod.literal(true);
        assert.strictEqual(trueLiteral.safeParse(true).success, true, 'Boolean literal should accept true');
        assert.strictEqual(trueLiteral.safeParse(false).success, false, 'Boolean literal should reject false');

        // Null literal
        const nullLiteral = zod.literal(null);
        assert.strictEqual(nullLiteral.safeParse(null).success, true, 'Null literal should accept null');
        assert.strictEqual(nullLiteral.safeParse(undefined).success, false, 'Null literal should reject undefined');

        // Undefined literal (explicitly allowed)
        const undefinedLiteral = zod.literal(undefined);
        assert.strictEqual(undefinedLiteral.safeParse(undefined).success, true, 'Undefined literal should accept undefined');
        assert.strictEqual(undefinedLiteral.safeParse(null).success, false, 'Undefined literal should reject null');

        done();
    });
});