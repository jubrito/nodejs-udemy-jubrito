import { Application } from "https://deno.land/x/oak/mod.ts";
import todosRoutes from './routes/todos.ts'; // Deno requires the file extention when importing

const app = new Application();

/* We need to call the routes method on Deno and allow methods to make sure Deno and Oak will properly handle incoming requests to our routes */
app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 3000 });