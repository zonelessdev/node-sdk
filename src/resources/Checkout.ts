import { HttpClient } from '../HttpClient';
import { CheckoutSessions } from './CheckoutSessions';

/**
 * Checkout API namespace.
 *
 * @see https://zoneless.com/docs/checkout/sessions
 */
export class Checkout {
  /** Checkout Sessions API resource */
  readonly sessions: CheckoutSessions;

  constructor(client: HttpClient) {
    this.sessions = new CheckoutSessions(client);
  }
}
