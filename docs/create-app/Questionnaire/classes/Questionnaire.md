[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [create-app/Questionnaire](../README.md) / Questionnaire

# Class: Questionnaire

Defined in: cli/src/create-app/Questionnaire.ts:19

Represents a Questionnaire to guide users in creating a Stone.js application.

## Constructors

### new Questionnaire()

> **new Questionnaire**(`options`): [`Questionnaire`](Questionnaire.md)

Defined in: cli/src/create-app/Questionnaire.ts:50

Initializes a new Questionnaire instance.

#### Parameters

##### options

[`QuestionnaireOptions`](../interfaces/QuestionnaireOptions.md)

The options to create a Questionnaire.

#### Returns

[`Questionnaire`](Questionnaire.md)

## Methods

### getAnswers()

> **getAnswers**(): `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: cli/src/create-app/Questionnaire.ts:139

Runs the questionnaire and collects user answers.

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

A promise that resolves with the user's answers.

***

### create()

> `static` **create**(`options`): [`Questionnaire`](Questionnaire.md)

Defined in: cli/src/create-app/Questionnaire.ts:41

Factory method to create a new Questionnaire instance.

#### Parameters

##### options

[`QuestionnaireOptions`](../interfaces/QuestionnaireOptions.md)

The options to create a Questionnaire.

#### Returns

[`Questionnaire`](Questionnaire.md)

A new instance of Questionnaire.
