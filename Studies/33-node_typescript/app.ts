const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')!;

function add(num1: number, num2: number) {
    return num1 + num2;
}

function addWithUnion(num1: number | string, num2: number | string) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    } else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + '' + num2;
    }
    return +num1 + +num2;
}

buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    console.log(result);
    var resultWithUnion = addWithUnion('1', '2');
    console.log(resultWithUnion);
    resultWithUnion = addWithUnion(1, 2);
    console.log(resultWithUnion);
    resultWithUnion = addWithUnion(1, '2');
    console.log(resultWithUnion);
})

console.log(add(1, 6));

// console.log(add('1', '6')); // will trigger 'Argument of type string is not assignable to type number