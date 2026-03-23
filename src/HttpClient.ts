export interface HttpClientConfig {
  apiKey: string;
  baseUrl: string;
  timeout?: number;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  body?: object;
  query?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
  /** Idempotency key for POST requests to prevent duplicate operations */
  idempotencyKey?: string;
  /** Connected account ID to act on behalf of (for platform operations) */
  zonelessAccount?: string;
}

/**
 * Extra options that can be passed to API requests.
 */
export interface RequestExtraOptions {
  /** Additional headers to include in the request */
  headers?: Record<string, string>;
  /** Idempotency key for POST requests to prevent duplicate operations */
  idempotencyKey?: string;
  /** Connected account ID to act on behalf of (for platform operations) */
  zonelessAccount?: string;
}

export interface ZonelessError {
  type: string;
  message: string;
  code?: string;
  param?: string;
  statusCode: number;
}

export class ZonelessApiError extends Error {
  readonly type: string;
  readonly code?: string;
  readonly param?: string;
  readonly statusCode: number;

  constructor(error: ZonelessError) {
    super(error.message);
    this.name = 'ZonelessApiError';
    this.type = error.type;
    this.code = error.code;
    this.param = error.param;
    this.statusCode = error.statusCode;
  }
}

/**
 * HTTP client for making requests to the Zoneless API.
 * Uses native fetch API (Node 18+).
 */
export class HttpClient {
  private readonly config: Required<HttpClientConfig>;

  constructor(config: HttpClientConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      timeout: config.timeout ?? 30000,
    };
  }

  /**
   * Makes a request to the Zoneless API.
   */
  async Request<T>(options: RequestOptions): Promise<T> {
    const url = this.BuildUrl(options.path, options.query);

    const headers: Record<string, string> = {
      'x-api-key': this.config.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add idempotency key for POST requests
    if (options.idempotencyKey) {
      headers['idempotency-key'] = options.idempotencyKey;
    }

    // Add connected account header for platform operations
    if (options.zonelessAccount) {
      headers['zoneless-account'] = options.zonelessAccount;
    }

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
      signal: AbortSignal.timeout(this.config.timeout),
    };

    if (options.body && options.method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);

    // Handle non-JSON responses gracefully
    let data: Record<string, unknown>;
    try {
      data = await response.json() as Record<string, unknown>;
    } catch {
      throw new ZonelessApiError({
        type: 'api_error',
        message: `Invalid response from API: ${response.status} ${response.statusText}`,
        statusCode: response.status,
      });
    }

    if (!response.ok) {
      const errorData = data.error as Record<string, unknown> | undefined;
      throw new ZonelessApiError({
        type: (errorData?.type as string) || 'api_error',
        message: (errorData?.message as string) || (data.message as string) || 'An error occurred',
        code: errorData?.code as string | undefined,
        param: errorData?.param as string | undefined,
        statusCode: response.status,
      });
    }

    return data as T;
  }

  /**
   * Makes a GET request.
   */
  async Get<T>(
    path: string,
    query?: Record<string, string | number | undefined>,
    options?: RequestExtraOptions
  ): Promise<T> {
    return this.Request<T>({
      method: 'GET',
      path,
      query,
      headers: options?.headers,
      zonelessAccount: options?.zonelessAccount,
    });
  }

  /**
   * Makes a POST request.
   */
  async Post<T>(path: string, body?: object, options?: RequestExtraOptions): Promise<T> {
    return this.Request<T>({
      method: 'POST',
      path,
      body,
      headers: options?.headers,
      idempotencyKey: options?.idempotencyKey,
      zonelessAccount: options?.zonelessAccount,
    });
  }

  /**
   * Makes a DELETE request.
   */
  async Delete<T>(path: string, options?: RequestExtraOptions): Promise<T> {
    return this.Request<T>({
      method: 'DELETE',
      path,
      headers: options?.headers,
      zonelessAccount: options?.zonelessAccount,
    });
  }

  /**
   * Builds the full URL with query parameters.
   */
  private BuildUrl(path: string, query?: Record<string, string | number | undefined>): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const url = new URL(`${baseUrl}/v1${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }
}

