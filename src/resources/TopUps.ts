import { BaseResource } from './Base';
import { TopUp, CheckDepositsResponse } from '../types/TopUp';
import {
  CreateTopUpInput,
  UpdateTopUpInput,
  ListTopUpsInput,
} from '../schemas/TopUpSchema';
import { ListResponse } from '../types/ApiResponse';
import { ApplyDateFilter } from '../utils';

/**
 * @see https://zoneless.com/docs/topups
 */
export class TopUps extends BaseResource {
  /** @see https://zoneless.com/docs/topups/create */
  async create(params: CreateTopUpInput): Promise<TopUp> {
    return this.client.Post<TopUp>('/topups', params);
  }

  /** @see https://zoneless.com/docs/topups/retrieve */
  async retrieve(id: string): Promise<TopUp> {
    return this.client.Get<TopUp>(`/topups/${id}`);
  }

  /** @see https://zoneless.com/docs/topups/update */
  async update(id: string, params: UpdateTopUpInput): Promise<TopUp> {
    return this.client.Post<TopUp>(`/topups/${id}`, params);
  }

  /** @see https://zoneless.com/docs/topups/list */
  async list(params: ListTopUpsInput = {}): Promise<ListResponse<TopUp>> {
    const query = this.BuildQuery(params);
    return this.client.Get<ListResponse<TopUp>>('/topups', query);
  }

  /** @see https://zoneless.com/docs/topups/cancel */
  async cancel(id: string): Promise<TopUp> {
    return this.client.Post<TopUp>(`/topups/${id}/cancel`, {});
  }

  /** @see https://zoneless.com/docs/topups/check-deposits */
  async checkDeposits(): Promise<CheckDepositsResponse> {
    return this.client.Post<CheckDepositsResponse>('/topups/check-deposits', {});
  }

  private BuildQuery(
    params: ListTopUpsInput
  ): Record<string, string | number | undefined> {
    const query: Record<string, string | number | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      status: params.status,
    };

    ApplyDateFilter(query, 'amount', params.amount);
    ApplyDateFilter(query, 'created', params.created);

    return query;
  }
}
