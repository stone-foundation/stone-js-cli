[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [create/Questionnaire](../README.md) / Questionnaire

# Class: Questionnaire

Defined in: [cli/src/create/Questionnaire.ts:12](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/create/Questionnaire.ts#L12)

Represents a Questionnaire to guide users in creating a Stone.js application.

## Constructors

### Constructor

> **new Questionnaire**(`context`): `Questionnaire`

Defined in: [cli/src/create/Questionnaire.ts:28](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/create/Questionnaire.ts#L28)

Initializes a new Questionnaire instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`Questionnaire`

## Methods

### getAnswers()

> **getAnswers**(): `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [cli/src/create/Questionnaire.ts:102](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/create/Questionnaire.ts#L102)

Runs the questionnaire and collects user answers.

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

A promise that resolves with the user's answers.

***

### create()

> `static` **create**(`context`): `Questionnaire`

Defined in: [cli/src/create/Questionnaire.ts:19](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/create/Questionnaire.ts#L19)

Factory method to create a new Questionnaire instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`Questionnaire`

A new instance of Questionnaire.
