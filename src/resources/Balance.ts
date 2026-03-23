import { BaseResource } from './Base';
import { RequestExtraOptions } from '../HttpClient';
import { Balance } from '../types/Balance';

/** @deprecated Use RequestExtraOptions instead */
export type RetrieveBalanceOptions = RequestExtraOptions;

/**
 * @see https://zoneless.com/docs/balance
 */
export class BalanceResource extends BaseResource {
  /** @see https://zoneless.com/docs/balance/retrieve */
  async retrieve(options?: RequestExtraOptions): Promise<Balance> {
    return this.client.Get<Balance>('/balance', undefined, options);
  }
}
