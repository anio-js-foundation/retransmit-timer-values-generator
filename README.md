# @anio-js-foundation/retransmit-timer-values-generator

A retransmission timeout number generator.

```js
import retransmitTimerValuesGenerator from "@anio-js-foundation/retransmit-timer-values-generator"

//
// Create a timeout value generator that will generate
// timeout values for 10 attempts
//
const generator1 = retransmitTimerValuesGenerator(10)
let i = 0;

while (generator1.getNumberOfAttemptsLeft() > 0) {
	console.log(i, generator1.getNextTimeoutValue())

	++i;
}

console.log("--")

//
// Automatically calculate how many attempts we will get with a time budget
// of 1000 ms (or 1 second)
//
const generator2 = retransmitTimerValuesGenerator.fromTimeBudget(1000)

while (generator2.getNumberOfAttemptsLeft() > 0) {
	console.log(generator2.getNextTimeoutValue())
}
```
