import { BaseResource } from './Base';
import { BalanceTransaction } from '../types/BalanceTransaction';
import { ListResponse } from '../types/ApiResponse';
import { ListBalanceTransactionsInput } from '../schemas/BalanceTransactionSchema';

export interface BalanceTransactionRequestOptions {
  /** Connected account ID to retrieve/list balance transactions for */
  zonelessAccount?: string;
}

/**
 * @see https://zoneless.com/docs/balance-transactions
 */
export class BalanceTransactions extends BaseResource {
  /** @see https://zoneless.com/docs/balance-transactions/retrieve */
  async retrieve(
    id: string,
    options: BalanceTransactionRequestOptions = {}
  ): Promise<BalanceTransaction> {
    const headers = this.BuildHeaders(options);
    return this.client.Get<BalanceTransaction>(
      `/balance_transactions/${id}`,
      undefined,
      headers
    );
  }

  /** @see https://zoneless.com/docs/balance-transactions/list */
  async list(
    params: ListBalanceTransactionsInput = {},
    options: BalanceTransactionRequestOptions = {}
  ): Promise<ListResponse<BalanceTransaction>> {
    const query = this.BuildQuery(params);
    const headers = this.BuildHeaders(options);
    return this.client.Get<ListResponse<BalanceTransaction>>(
      '/balance_transactions',
      query,
      headers
    );
  }

  private BuildHeaders(
    options: BalanceTransactionRequestOptions
  ): Record<string, string> | undefined {
    if (options.zonelessAccount) {
      return { 'Zoneless-Account': options.zonelessAccount };
    }
    return undefined;
  }

  private BuildQuery(
    params: ListBalanceTransactionsInput
  ): Record<string, string | number | undefined> {
    const query: Record<string, string | number | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      type: params.type,
      source: params.source,
      currency: params.currency,
      payout: params.payout,
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
