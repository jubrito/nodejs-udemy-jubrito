import { Application } from "https://deno.land/x/oak/mod.ts";
import todosRoutes from './routes/todos.ts'; // Deno requires the file extention when importing

const app = new Application();

app.use(async (ctx, next) => {
    console.log('When this middleware is done, Oak will automatically send back a response.');
    console.log('With next(), we might send back a response too early, before the route has been able to process the async requests.')
    console.log('Therefore, whenever you have any middlewares that do async stuff, you should make all your middlewares async and always await next.');
    console.log("Adding async await to this middleware tells Oak that we don't just want to start the next middlewares in line, but that we also want to wait for them to finish before we send back that automatically generated response.");
    console.log("Otherwise, the response bodies set by our async route middlewares, will not be taken into account.")
    await next();
})

/* We need to call the routes method on Deno and allow methods to make sure Deno and Oak will properly handle incoming requests to our routes */
app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });