import { BaseResource } from './Base';
import { RequestExtraOptions } from '../HttpClient';
import { Transfer } from '../types/Transfer';
import {
  CreateTransferInput,
  UpdateTransferInput,
  ListTransfersInput,
} from '../schemas/TransferSchema';
import { ListResponse } from '../types/ApiResponse';

/**
 * @see https://zoneless.com/docs/transfers
 */
export class Transfers extends BaseResource {
  /** @see https://zoneless.com/docs/transfers/create */
  async create(
    params: CreateTransferInput,
    options?: RequestExtraOptions
  ): Promise<Transfer> {
    return this.client.Post<Transfer>('/transfers', params, options);
  }

  /** @see https://zoneless.com/docs/transfers/retrieve */
  async retrieve(id: string, options?: RequestExtraOptions): Promise<Transfer> {
    return this.client.Get<Transfer>(`/transfers/${id}`, undefined, options);
  }

  /** @see https://zoneless.com/docs/transfers/update */
  async update(
    id: string,
    params: UpdateTransferInput,
    options?: RequestExtraOptions
  ): Promise<Transfer> {
    return this.client.Post<Transfer>(`/transfers/${id}`, params, options);
  }

  /** @see https://zoneless.com/docs/transfers/list */
  async list(
    params: ListTransfersInput = {},
    options?: RequestExtraOptions
  ): Promise<ListResponse<Transfer>> {
    const query = this.BuildQuery(params);
    return this.client.Get<ListResponse<Transfer>>('/transfers', query, options);
  }

  private BuildQuery(
    params: ListTransfersInput
  ): Record<string, string | number | undefined> {
    const query: Record<string, string | number | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      destination: params.destination,
      transfer_group: params.transfer_group,
    };

    if (params.created) {
      if (params.created.gt !== undefined) {
        query['created[gt]'] = params.created.gt;
      }
      if (params.created.gte !== undefined) {
        query['created[gte]'] = params.created.gte;
      }
      if (params.created.lt !== undefined) {
        query['created[lt]'] = params.created.lt;
      }
      if (params.created.lte !== undefined) {
        query['created[lte]'] = params.created.lte;
      }
    }

    return query;
  }
}
