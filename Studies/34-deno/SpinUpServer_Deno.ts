import { serve } from "https://deno.land/std@0.135.0/http/server.ts";

function handlerFunctionThatWillBeCalledForEachIncomingRequest (req: Request): Response {
    return new Response("Hello World, Spinning up a server in Deno");
}
const httpServer = serve(handlerFunctionThatWillBeCalledForEachIncomingRequest, { port: 3000 })