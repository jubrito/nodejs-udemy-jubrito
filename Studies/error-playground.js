const sum = (a, b) => {
    if (a && b) {
        return a + b;
    }
    throw new Error('Invalid arguments')
}

try {
    console.log(sum(1));
} catch (error) {
    console.log('(Syncronous) Error Handling: his allows the errors to be handled displaying only this message when an error is thrown in a syncronous code')
}
