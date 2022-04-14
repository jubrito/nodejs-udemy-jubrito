const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')!;


/** Generics
 * A generic type simply is a type that interacts with another type, and an array is a great example.
*/
type shortcut = number[];
type longerForm = Array<number>; // shortcut = longerForm
const numResults: shortcut = [];
const alternativeNumResults: longerForm = [];
const textResults: string[] = [];

/**
 * Type Aliases vs Interface
 * If you're just defining the structure of an object, you can use either of the two. Using interfaces is a bit more common but it's not a must to. Interfaces can however also be used to force classes to implement certain methods or functionalities.
 */
type NumOrString = number | string;
interface ResultObject { val: number; timestamp: Date };

function add(num1: number, num2: number) {
    return num1 + num2;
}

function addWithUnion(num1: NumOrString, num2: NumOrString) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    } else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + '' + num2;
    }
    return +num1 + +num2;
}

function printResult(resultObject: ResultObject) {
    console.log(resultObject.val);
}

buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    numResults.push(result);
    var resultWithUnion = addWithUnion(num1, num2);
    textResults.push(resultWithUnion as string);
    resultWithUnion = addWithUnion(+num1, +num2);
    numResults.push(resultWithUnion as number);
    resultWithUnion = addWithUnion(+num1, num2);
    printResult({val: resultWithUnion as number, timestamp: new Date()})
})

console.log(add(1, 6));
// console.log(add('1', '6')); // will trigger 'Argument of type string is not assignable to type number

const myPromise = new Promise<String>((resolve, reject) => { // 
    setTimeout(() => {
        resolve('It worked! Adding the Generic Type <Strings> allows handling the result as a string (e.g: adding .split())');
    }, 1000);
});

myPromise.then((result) => {
    console.log(result.split('!')); // A promise is a generic type because it eventually resolves to a value, and the value it resolves to, that's the generic type for the promise.
})