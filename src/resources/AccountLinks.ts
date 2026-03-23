import { BaseResource } from './Base';
import { AccountLink } from '../types/AccountLink';
import { CreateAccountLinkInput } from '../schemas/AccountLinkSchema';

/**
 * @see https://zoneless.com/docs/account-links
 */
export class AccountLinks extends BaseResource {
  /** @see https://zoneless.com/docs/account-links/create */
  async create(params: CreateAccountLinkInput): Promise<AccountLink> {
    return this.client.Post<AccountLink>('/account_links', params);
  }
}
