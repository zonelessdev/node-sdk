import { BaseResource } from './Base';
import { BalanceTransaction } from '../types/BalanceTransaction';
import { ListResponse } from '../types/ApiResponse';
import { ListBalanceTransactionsInput } from '../schemas/BalanceTransactionSchema';
import { ApplyDateFilter } from '../utils';

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

    ApplyDateFilter(query, 'created', params.created);

    return query;
  }
}
