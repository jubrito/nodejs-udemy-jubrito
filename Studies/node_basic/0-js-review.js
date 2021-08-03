
// FS AND WRITE FILE
const fs = require('fs');

function writeAFileToTheHardDrive(fileName, fileContent) {
    fs.writeFileSync(fileName, fileContent); 
}
writeAFileToTheHardDrive('hello.txt', 'Hello Node.js')

// OBJECTS WITH FUNCTIONS
const person = {
    name: 'Juliana',
    // it doesn't work with greet: () => {console.log('Hi, I'm ' + this.name)}
    greet: function() {
        console.log("Hi, I'm " + this.name);
    }
    // alsoWorks() {
    //     console.log("Hi, I'm " + this.name);
    // }
}
person.greet();

// ARRAYS
const hobbies = ['Cooking', 'Eating'];
let newArrayReturnedAfterMap = hobbies.map(hobby => 'Hobby: ' + hobby); 
console.log(newArrayReturnedAfterMap) // [ 'Hobby: Cooking', 'Hobby: Eating']

/*  Arrays are reference types = they store an address pointing at the place in memory where 
    the array values are stored, that's why you can change values of const arrays, 
    because your are changing the value not the pointer stored that points to the value */
hobbies.push('Programming');

// SPREAD (Pull elements or proprierties out of arrays or objects)
const copiedArrayWithSlice = hobbies.slice(); 
const copiedArrayWithSpread = [...hobbies];
const copiedObjectWithSpread = {...person};

// REST (Merge multiple arguments into an array, )
const toArrayWithAnyNumberOfArguments = (...args) => {
    return args;
}

// DESESTRUCTURING
const printObjectProprierty = ({ name }) => {
    console.log(name);
}
const {name} = person;
const numbersArray = ['One', 'Two'];
const [numberOne, numberTwo] = numbersArray;
printObjectProprierty(person);


// ASYNC CODE & PROMISSES

const fetchData = () => { // code normally handled by libraries
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done');
        }, 1500)
    });
    return promise;
};

setTimeout(() => {
    fetchData()
        .then(text => {
            console.log(text);
            return fetchData();
        })
        .then(text2 => {
            console.log(text2);
        })
}, 2000);