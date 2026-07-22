import { BaseResource } from './Base';
import { CheckoutSession, CheckoutSessionDeleted, CheckoutSessionLineItem } from '../types/CheckoutSession';
import {
  CreateCheckoutSessionInput,
	UpdateCheckoutSessionInput,
	ListCheckoutSessionsInput,
	RetrieveCheckoutSessionInput,
	ExpireCheckoutSessionInput,
	ListCheckoutSessionLineItemsInput
} from '../schemas/CheckoutSessionSchema';
import { ListResponse } from '../types/ApiResponse';
import { ApplyDateFilter } from '../utils';

/**
 * @see https://zoneless.com/docs/checkout/sessions
 */
export class CheckoutSessions extends BaseResource {

  /** @see https://zoneless.com/docs/checkout/sessions/create */
  async create(params: CreateCheckoutSessionInput): Promise<CheckoutSession> {
    return this.client.Post<CheckoutSession>('/checkout/sessions', params);
  }

	/** @see https://zoneless.com/docs/checkout/sessions/update */
	async update(id: string, params: UpdateCheckoutSessionInput): Promise<CheckoutSession> {
		return this.client.Post<CheckoutSession>(`/checkout/sessions/${id}`, params);
	}

	/** @see https://zoneless.com/docs/checkout/sessions/retrieve */
	async retrieve(id: string, params: RetrieveCheckoutSessionInput = {}): Promise<CheckoutSession> {
		return this.client.Get<CheckoutSession>(`/checkout/sessions/${id}`, params);
	}

	/** @see https://zoneless.com/docs/checkout/sessions/expire */
	async expire(id: string, params: ExpireCheckoutSessionInput = {}): Promise<CheckoutSession> {
		return this.client.Post<CheckoutSession>(`/checkout/sessions/${id}/expire`, params);
	}

	/** @see https://zoneless.com/docs/checkout/sessions/list-line-items */
	async listLineItems(id: string, params: ListCheckoutSessionLineItemsInput = {}): Promise<ListResponse<CheckoutSessionLineItem>> {
		return this.client.Get<ListResponse<CheckoutSessionLineItem>>(`/checkout/sessions/${id}/line_items`, params);
	}

	/** @see https://zoneless.com/docs/checkout/sessions/list */
  async list(
    params: ListCheckoutSessionsInput = {}
  ): Promise<ListResponse<CheckoutSession>> {
		let query : Record<string, any> = {
			limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      customer: params.customer,
      customer_account: params.customer_account,
      status: params.status,
      subscription: params.subscription,
      payment_intent: params.payment_intent,
      payment_link: params.payment_link,
		};
		if (params.customer_details) {
			query['customer_details[email]'] = params.customer_details.email;
		}
		ApplyDateFilter(query, 'created', params.created);
    return this.client.Get<ListResponse<CheckoutSession>>(
      `/checkout/sessions`,
      query
    );
  }

	/** @see https://zoneless.com/docs/checkout/sessions/delete */
	async del(customerId: string): Promise<CheckoutSessionDeleted> {
		return this.client.Delete<CheckoutSessionDeleted>(
			`/checkout/sessions/${customerId}`
		);
	}
}
