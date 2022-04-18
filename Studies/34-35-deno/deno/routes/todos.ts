import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

interface Todo {
    id: string;
    text: string;
}

let todos: Todo[] = [];

router.get('/todos', (ctx) => {
    /** Oak will
     *  Automatically send responses and 
     *  Parse objects into json and set the apropriate response headers
     */
    ctx.response.body = { todos: todos }; 
});
router.post('/todo', async (ctx) => {
    /** Oak will
     * Automatically look at the request (request body, and all the request headers), and if the request signals that the request carries JSON data (by setting the appropriate request headers) then Oak will automatically parse that body and gives access to the parsed body on the context request body field here. */
    const data = await ctx.request.body().value; // body returns a promise
    const newTodo: Todo = { 
        id: new Date().toISOString(), 
        text: data.text,
    }
    todos.push(newTodo);
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
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    todos.filter(todo => todo.id !== todoId);
    ctx.response.body = { message: 'Deleted todo', todos: todos };
});

export default router;