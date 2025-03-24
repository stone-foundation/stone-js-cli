[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [create/Questionnaire](../README.md) / Questionnaire

# Class: Questionnaire

Defined in: [cli/src/create/Questionnaire.ts:11](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/create/Questionnaire.ts#L11)

Represents a Questionnaire to guide users in creating a Stone.js application.

## Constructors

### new Questionnaire()

> **new Questionnaire**(`options`): [`Questionnaire`](Questionnaire.md)

Defined in: [cli/src/create/Questionnaire.ts:31](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/create/Questionnaire.ts#L31)

Initializes a new Questionnaire instance.

#### Parameters

##### options

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The options to create a Questionnaire.

#### Returns

[`Questionnaire`](Questionnaire.md)

## Methods

### getAnswers()

> **getAnswers**(): `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [cli/src/create/Questionnaire.ts:121](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/create/Questionnaire.ts#L121)

Runs the questionnaire and collects user answers.

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

A promise that resolves with the user's answers.

***

### create()

> `static` **create**(`options`): [`Questionnaire`](Questionnaire.md)

Defined in: [cli/src/create/Questionnaire.ts:22](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/create/Questionnaire.ts#L22)

Factory method to create a new Questionnaire instance.

#### Parameters

##### options

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The options to create a Questionnaire.

#### Returns

[`Questionnaire`](Questionnaire.md)

A new instance of Questionnaire.
