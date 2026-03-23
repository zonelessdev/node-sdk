import { BaseResource } from './Base';
import { LoginLink } from '../types/LoginLink';

/**
 * @see https://zoneless.com/docs/login-links
 */
export class LoginLinks extends BaseResource {
  /** @see https://zoneless.com/docs/login-links/create */
  async create(account: string): Promise<LoginLink> {
    return this.client.Post<LoginLink>(`/accounts/${account}/login_links`, {});
  }
}
