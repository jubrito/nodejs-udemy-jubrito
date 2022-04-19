import { Application } from "https://deno.land/x/oak/mod.ts";
import todosRoutes from './routes/todos.ts'; // Deno requires the file extention when importing
import { connectToDb } from '../helpers/db_client.ts';

connectToDb();
const app = new Application();

app.use(async (ctx, next) => {
    console.log('When this middleware is done, Oak will automatically send back a response.');
    console.log('With next(), we might send back a response too early, before the route has been able to process the async requests.')
    console.log('Therefore, whenever you have any middlewares that do async stuff, you should make all your middlewares async and always await next.');
    console.log("Adding async await to this middleware tells Oak that we don't just want to start the next middlewares in line, but that we also want to wait for them to finish before we send back that automatically generated response.");
    console.log("Otherwise, the response bodies set by our async route middlewares, will not be taken into account.")
    await next();
})

app.use(async function handleCORS (ctx, next) {
    // 'Access-Control-Allow-Origin' = Controls of whichever domains will be allowed to access our resources.
    ctx.response.headers.set('Access-Control-Allow-Origin', '*'); // every domain is allowed to access our resources.
    // 'Access-Controll-Allow-Methods' = Which kind of HTTP methods can be used for requests bein send to this back-end
    ctx.response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    // 'Access-Control-Allow-Headers' = Which headers may be set by the front-end when it requests data
    ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // PUT and POSTs headers (content-type) are application/json, the data attached to this request will be in the Json format, so Oak will automatically parse that when we try to access the request body
    await next();
})

/* We need to call the routes method on Deno and allow methods to make sure Deno and Oak will properly handle incoming requests to our routes */
app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });