/**
 * Net - abstraction layer around Fetch.
 */

import fetch, { Response, HeadersInit } from 'node-fetch'; 
import * as Streams from './streams'; // Assuming this still provides a compatible Streams.ReadWriteStream
declare const Config: any;

export interface PostData {
    [key: string]: string | number;
}

export interface NetRequestOptions {
    method?: string;
    headers?: { [key: string]: string };
    body?: string | PostData;
    writable?: boolean;
    query?: PostData;
    timeout?: number;
}

export class HttpError extends Error {
    statusCode?: number;
    body: string;
    constructor(message: string, statusCode: number | undefined, body: string) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.body = body;
        Error.captureStackTrace(this, HttpError);
    }
}

export class NetStream extends Streams.ReadWriteStream {
    uri: string;
    opts: NetRequestOptions;
    response: Promise<Response | null> | Response | null;
    statusCode: number | null;
    headers: HeadersInit | null;
    state: 'pending' | 'success' | 'error';
    abortController: AbortController;

    constructor(uri: string, opts: NetRequestOptions = {}) {
        super();
        this.uri = uri;
        this.opts = opts;
        this.response = null;
        this.statusCode = null;
        this.headers = null;
        this.state = 'pending';
        this.abortController = new AbortController();
        this.makeRequest(opts);
    }

    static encodeQuery(data: PostData) {
        const params = new URLSearchParams();
        for (const key in data) {
            params.append(key, String(data[key]));
        }
        return params.toString();
    }

    async makeRequest(opts: NetRequestOptions) {
        let url = this.uri;
        if (opts.query) {
            url += (url.includes('?') ? '&' : '?') + NetStream.encodeQuery(opts.query);
        }

        let headers: HeadersInit = opts.headers || {};
        let body: string | undefined;

        if (opts.body && typeof opts.body !== 'string') {
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            body = NetStream.encodeQuery(opts.body);
        } else if (typeof opts.body === 'string') {
            body = opts.body;
        }

        const method = opts.method || 'GET';
        const timeout = opts.timeout !== undefined ? opts.timeout : 5000;
        const requestInit: RequestInit = {
            method,
            headers,
            body,
            signal: this.abortController.signal,
        };

        const timeoutId = setTimeout(() => {
            this.state = 'error';
            this.abortController.abort();
            this.pushError(new Error("Request timeout"));
        }, timeout);

        try {
            const response = await fetch(url, requestInit);
            clearTimeout(timeoutId);
            this.response = response;
            this.statusCode = response.status;
            this.headers = Object.fromEntries(response.headers.entries());

            const reader = response.body?.getReader();
            if (!reader) {
                this.state = 'success';
                this.pushEnd();
                return;
            }

            // Read the data from the response body and push it into our stream
            const pump = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    this.state = 'success';
                    this.pushEnd();
                    return;
                }
                if (value) this.push(value);
                pump();
            };
            pump();

        } catch (err) {
            clearTimeout(timeoutId);
            if ((err as Error).name === 'AbortError') {
                // Already handled as timeout
            } else {
                this.pushError(err as Error);
            }
        }
    }

    _write(data: string | Buffer): Promise<void> | void {
        // With fetch, the request body is typically set once at the start.
        // Streaming uploads would need a different approach (e.g. a TransformStream passed to fetch).
        throw new Error("You must specify opts.body before the request. Streaming request bodies are not supported in this example.");
    }

    _read() {
        // No-op. Fetch streams are "pull" streams.
    }

    _pause() {
        // Not directly supported by fetch's ReadableStream. You'd need more complex handling if truly required.
    }
}

export class NetRequest {
    uri: string;
    response?: Response;

    constructor(uri: string) {
        this.uri = uri;
    }

    /**
     * Makes a request and returns a NetStream (readable).
     */
    getStream(opts: NetRequestOptions = {}) {
        if (typeof Config !== 'undefined' && Config.noNetRequests) {
            throw new Error(`Net requests are disabled.`);
        }
        const stream = new NetStream(this.uri, opts);
        return stream;
    }

    /**
     * Makes a GET request and returns the response as a string.
     * Throws if the status code is not 200.
     */
    async get(opts: NetRequestOptions = {}): Promise<string> {
        const stream = this.getStream(opts);
        const response = await stream.response;
        if (response) this.response = response;
        const status = response ? response.status : 0;
        const text = await stream.readAll();
        if (response && status !== 200) {
            throw new HttpError(response.statusText || "Connection error", status, text);
        }
        return text;
    }

    /**
     * Makes a POST request and returns the response as a string.
     */
    post(opts: Omit<NetRequestOptions, 'body'>, body: PostData | string): Promise<string>;
    post(opts?: NetRequestOptions): Promise<string>;
    async post(opts: NetRequestOptions = {}, body?: PostData | string) {
        if (!body) body = opts.body;
        return this.get({
            ...opts,
            method: 'POST',
            body,
        });
    }
}

export const Net = Object.assign((path: string) => new NetRequest(path), {
    NetRequest, NetStream,
});
