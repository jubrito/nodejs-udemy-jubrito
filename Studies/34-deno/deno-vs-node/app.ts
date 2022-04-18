import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((context) => {
    context.response.body = "Hello World!";
})

await app.listen({ port: 8000 });