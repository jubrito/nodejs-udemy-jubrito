const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')!;

const numResults: number[] = [];
const textResults: string[] = [];

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