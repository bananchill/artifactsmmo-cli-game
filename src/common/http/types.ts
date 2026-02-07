import { Context, type Effect } from "effect";

export interface HttpRequestConfig {
  readonly headers?: Record<string, string>;
  readonly query?: Record<string, string | number>;
  readonly timeoutMs?: number;
  readonly retries?: number;
  readonly signal?: AbortSignal;
}

export type HttpError =
  | { _tag: "NetworkError"; cause: unknown }
  | { _tag: "TimeoutError" }
  | { _tag: "BadStatus"; status: number; body: unknown }
  | { _tag: "DecodeError"; cause: unknown };

export interface IHttpClient {
  get<Response>(url: string, config?: HttpRequestConfig): Effect.Effect<Response, HttpError | any>;

  post<Request, Response>(
    url: string,
    body: Request,
    config?: HttpRequestConfig,
  ): Effect.Effect<Response, HttpError | any>;

  // put<Request, Response>(
  //   url: string,
  //   body: Request,
  //   config?: HttpRequestConfig,
  // ): Effect.Effect<Response, HttpError>;

  // delete<Response>(url: string, config?: HttpRequestConfig): Effect.Effect<Response, HttpError>;
}
export class HttpClient extends Context.Tag("HttpClient")<HttpClient, IHttpClient>() {}
