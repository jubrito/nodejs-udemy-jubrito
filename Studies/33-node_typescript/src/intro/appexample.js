"use strict";
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const buttonElement = document.querySelector('button');
const numResults = [];
const alternativeNumResults = [];
const textResults = [];
;
function add(num1, num2) {
    return num1 + num2;
}
function addWithUnion(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + '' + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObject) {
    console.log(resultObject.val);
}
buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    numResults.push(result);
    var resultWithUnion = addWithUnion(num1, num2);
    textResults.push(resultWithUnion);
    resultWithUnion = addWithUnion(+num1, +num2);
    numResults.push(resultWithUnion);
    resultWithUnion = addWithUnion(+num1, num2);
    printResult({ val: resultWithUnion, timestamp: new Date() });
});
console.log(add(1, 6));
// console.log(add('1', '6')); // will trigger 'Argument of type string is not assignable to type number
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('It worked! Adding the Generic Type <Strings> allows handling the result as a string (e.g: adding .split())');
    }, 1000);
});
myPromise.then((result) => {
    console.log(result.split('!')); // A promise is a generic type because it eventually resolves to a value, and the value it resolves to, that's the generic type for the promise.
});
