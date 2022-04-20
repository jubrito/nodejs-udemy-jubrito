import { Router } from "https://deno.land/x/oak/mod.ts";
import { getDb } from '../../helpers/db_client.ts';
import {
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

let todos: Todo[] = [];

router.get('/todos', async (ctx) => {
    /** Oak will
     *  Automatically send responses and 
     *  Parse objects into json and set the apropriate response headers
     */

    // if 'todos' collection doesn't exist, MongoDB will create it
    const todos = await getDb().collection('todos') .find();
    const transformedTodos = todos.map((todo: any) => {
        console.log('todo', todo)
        return {
            id: todo._id.toString(), // $oid property provided by mongo library that holds the generated id as string
            text: todo.text
        }
    })
    ctx.response.body = { todos: transformedTodos }; 
});
router.post('/todo', async (ctx) => {
    /** Oak will
     * Automatically look at the request (request body, and all the request headers), and if the request signals that the request carries JSON data (by setting the appropriate request headers) then Oak will automatically parse that body and gives access to the parsed body on the context request body field here. */
    const data = await ctx.request.body().value; // body returns a promise
    const newTodo: Todo = { 
        text: data.text,
    }
    const idOfNewTodoGeneratedByMongoDb = await getDb().collection('todos').insertOne(newTodo);
    newTodo.id = idOfNewTodoGeneratedByMongoDb.$oid; 
    ctx.response.body = { message: "Created todo", todo: newTodo };
});
router.put('/todo/:todoId', async (ctx) => {
    const data = await ctx.request.body().value;
    const todoId = ctx.params.todoId;
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    todos[todoIndex] = { id: todos[todoIndex].id, text: data.text };
    ctx.response.body = { message: "Updated todo", todos: todos };
});
router.delete('/todo/:todoId', (ctx) => {
    const todoId = ctx.params.todoId;
    todos = todos.filter(todo => todo.id !== todoId);
    ctx.response.body = { message: 'Deleted todo', todos: todos };
});

export default router;