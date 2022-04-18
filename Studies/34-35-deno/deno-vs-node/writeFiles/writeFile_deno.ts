let message: string;

message = "This is a test with Deno and should be stored in a file! \r\nIf we try to write a file with Deno, writeFile wants two main arguments here, it wants a path to the file, including the file name and the data that should be written to the file. And the data should be a Uint8Array, which is a strange data type, but which is actually a core data type built into JavaScript, which in the end is an array full of bytes. Now, we will be able to convert our text to bytes. So it's no problem that we have no bytes right now, but that we only have a string";

const fileName = 'deno-message.txt';
const encoder = new TextEncoder();
const data_Uint8Array_ConvertingTextToBites = encoder.encode(message);
Deno
    .writeFile(fileName, data_Uint8Array_ConvertingTextToBites)
    .then(() => {
        console.log("Deno embraces modern JavaScript features like Promises. Therefore writeFile does not take a call back to let us know once it's done. Instead here, we now can call then or a catch because writeFile returns a promise.")
    });

// Run this with deno run writeFile_deno.ts