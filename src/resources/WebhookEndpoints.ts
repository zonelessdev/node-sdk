import { BaseResource } from './Base';
import { WebhookEndpoint, WebhookEndpointDeletedResponse } from '../types/WebhookEndpoint';
import {
  CreateWebhookEndpointInput,
  UpdateWebhookEndpointInput,
  ListWebhookEndpointsInput,
} from '../schemas/WebhookEndpointSchema';
import { ListResponse } from '../types/ApiResponse';

/**
 * @see https://zoneless.com/docs/webhook-endpoints
 */
export class WebhookEndpoints extends BaseResource {
  /** @see https://zoneless.com/docs/webhook-endpoints/create */
  async create(params: CreateWebhookEndpointInput): Promise<WebhookEndpoint> {
    return this.client.Post<WebhookEndpoint>('/webhook_endpoints', params);
  }

  /** @see https://zoneless.com/docs/webhook-endpoints/retrieve */
  async retrieve(id: string): Promise<WebhookEndpoint> {
    return this.client.Get<WebhookEndpoint>(`/webhook_endpoints/${id}`);
  }

  /** @see https://zoneless.com/docs/webhook-endpoints/update */
  async update(id: string, params: UpdateWebhookEndpointInput): Promise<WebhookEndpoint> {
    return this.client.Post<WebhookEndpoint>(`/webhook_endpoints/${id}`, params);
  }

  /** @see https://zoneless.com/docs/webhook-endpoints/delete */
  async del(id: string): Promise<WebhookEndpointDeletedResponse> {
    return this.client.Delete<WebhookEndpointDeletedResponse>(`/webhook_endpoints/${id}`);
  }

  /** @see https://zoneless.com/docs/webhook-endpoints/list */
  async list(params: ListWebhookEndpointsInput = {}): Promise<ListResponse<WebhookEndpoint>> {
    const query: Record<string, string | number | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
    };

    return this.client.Get<ListResponse<WebhookEndpoint>>('/webhook_endpoints', query);
  }
}
