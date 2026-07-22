import { BaseResource } from './Base';
import { Subscription } from '../types/Subscription';
import {
  CancelSubscriptionInput,
  CreateSubscriptionInput,
  ListSubscriptionsInput,
  MigrateSubscriptionInput,
  ResumeSubscriptionInput,
  RetrieveSubscriptionInput,
  UpdateSubscriptionInput,
} from '../schemas/SubscriptionSchema';
import { ListResponse } from '../types/ApiResponse';
import { ApplyDateFilter } from '../utils';

/**
 * @see https://zoneless.com/docs/subscriptions
 */
export class Subscriptions extends BaseResource {
  /** @see https://zoneless.com/docs/subscriptions/create */
  async create(params: CreateSubscriptionInput): Promise<Subscription> {
    return this.client.Post<Subscription>('/subscriptions', params);
  }

  /** @see https://zoneless.com/docs/subscriptions/update */
  async update(
    id: string,
    params: UpdateSubscriptionInput
  ): Promise<Subscription> {
    return this.client.Post<Subscription>(`/subscriptions/${id}`, params);
  }

  /** @see https://zoneless.com/docs/subscriptions/retrieve */
  async retrieve(
    id: string,
    params: RetrieveSubscriptionInput = {}
  ): Promise<Subscription> {
    return this.client.Get<Subscription>(`/subscriptions/${id}`, params);
  }

  /** @see https://zoneless.com/docs/subscriptions/list */
  async list(
    params: ListSubscriptionsInput = {}
  ): Promise<ListResponse<Subscription>> {
    return this.client.Get<ListResponse<Subscription>>(
      '/subscriptions',
      this.BuildQuery(params)
    );
  }

  /**
   * Cancels a customer's subscription immediately.
   * @see https://zoneless.com/docs/subscriptions/cancel
   */
  async cancel(
    id: string,
    params: CancelSubscriptionInput = {}
  ): Promise<Subscription> {
    return this.client.Delete<Subscription>(`/subscriptions/${id}`, params);
  }

  /**
   * Upgrades the `billing_mode` of an existing subscription to `flexible`.
   * @see https://zoneless.com/docs/subscriptions/migrate
   */
  async migrate(
    id: string,
    params: MigrateSubscriptionInput
  ): Promise<Subscription> {
    return this.client.Post<Subscription>(
      `/subscriptions/${id}/migrate`,
      params
    );
  }

  /**
   * Resumes a paused subscription.
   * @see https://zoneless.com/docs/subscriptions/resume
   */
  async resume(
    id: string,
    params: ResumeSubscriptionInput = {}
  ): Promise<Subscription> {
    return this.client.Post<Subscription>(
      `/subscriptions/${id}/resume`,
      params
    );
  }

  private BuildQuery(
    params: ListSubscriptionsInput
  ): Record<string, string | number | boolean | undefined> {
    const query: Record<string, string | number | boolean | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      collection_method: params.collection_method,
      customer: params.customer,
      customer_account: params.customer_account,
      price: params.price,
      status: params.status,
      test_clock: params.test_clock,
    };

    if (params.automatic_tax?.enabled !== undefined) {
      query['automatic_tax[enabled]'] = params.automatic_tax.enabled;
    }

    ApplyDateFilter(query, 'created', params.created);
    ApplyDateFilter(query, 'current_period_end', params.current_period_end);
    ApplyDateFilter(query, 'current_period_start', params.current_period_start);

    return query;
  }
}
