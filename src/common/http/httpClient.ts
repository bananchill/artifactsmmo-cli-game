import { Effect, Layer } from "effect";
import { HttpClient, type HttpRequestConfig } from "./types.js";

const get = <Response>(url: string, config?: HttpRequestConfig) =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return res.json() as Promise<Response>;
    },
    catch: (e) => console.log(e),
  });

const HttpClientLayer = Layer.scoped(
  HttpClient,
  Effect.gen(function* () {
    return {
      get: <Response>(url: string, config?: HttpRequestConfig) =>
        Effect.tryPromise({
          try: async () => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }
            return res.json() as Promise<Response>;
          },
          catch: (e) => console.log(e),
        }),
      post: <Request, Response>(url: string, body: Request, config?: HttpRequestConfig) => {
        return 123 as Response;
      },
    };
  }),
);
