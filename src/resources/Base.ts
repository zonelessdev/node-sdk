import { HttpClient } from '../HttpClient';

/**
 * Base class for all API resources.
 * Provides access to the HTTP client for making requests.
 */
export abstract class BaseResource {
  protected readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }
}

