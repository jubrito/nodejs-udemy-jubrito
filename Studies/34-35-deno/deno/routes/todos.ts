import { Router } from "https://deno.land/x/oak/mod.ts";
import { getDb } from '../../helpers/db_client.ts';
import {
    Document,
    ObjectId
  } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

const router = new Router();

interface Todo {
    id?: string;
    text: string;
}

interface TodoOnDatabase { 
    _id: ObjectId, 
    text: string
}

router.get('/todos', async (ctx) => {
    /** Oak will
     *  Automatically send responses and 
     *  Parse objects into json and set the apropriate response headers
     */

    // if 'todos' collection doesn't exist, MongoDB will create it
    const todos = await getDb().collection('todos').find().toArray();
    const transformedTodos = todos.map((todo: Document) => ({
        id: todo._id.toString(), // $oid property provided by mongo library that holds the generated id as string
        text: todo.text,
    }))
    ctx.response.body = { todos: transformedTodos }; 
});
router.post('/todo', async (ctx) => {
    /** Oak will
     * Automatically look at the request (request body, and all the request headers), and if the request signals that the request carries JSON data (by setting the appropriate request headers) then Oak will automatically parse that body and gives access to the parsed body on the context request body field here. */
    const data = await ctx.request.body().value; // body returns a promise
    const newTodo: Todo = { 
        text: data.text,
    }
    const todoIdGeneratedByMongoDb = await getDb().collection('todos').insertOne(newTodo);
    newTodo.id = todoIdGeneratedByMongoDb.$oid; 
    ctx.response.body = { message: "Created todo", todo: newTodo };
});
router.put('/todo/:todoId', async (ctx) => {
    const data = await ctx.request.body().value;
    const todoId = ctx.params.todoId!; // ! = will never be undefined

    const filter = { _id: new ObjectId(todoId) };
    const updateInstructions = { $set: { text: data.text }}
    await getDb().collection('todos').updateOne(filter, updateInstructions);
    ctx.response.body = { message: "Updated todo" };
});
router.delete('/todo/:todoId', async (ctx) => {
    const todoId = ctx.params.todoId!; // ! = will never be undefined
    await getDb().collection('todos').deleteOne({ _id: new ObjectId(todoId)});
    ctx.response.body = { message: 'Deleted todo' };
});

export default router;