import { HttpClient } from './HttpClient';
import { Accounts } from './resources/Accounts';
import { AccountLinks } from './resources/AccountLinks';
import { BalanceResource } from './resources/Balance';
import { BalanceTransactions } from './resources/BalanceTransactions';
import { Checkout } from './resources/Checkout';
import { Customers } from './resources/Customers';
import { Events } from './resources/Events';
import { LoginLinks } from './resources/LoginLinks';
import { Payouts } from './resources/Payouts';
import { Prices } from './resources/Prices';
import { Products } from './resources/Products';
import { Subscriptions } from './resources/Subscriptions';
import { TopUps } from './resources/TopUps';
import { Transfers } from './resources/Transfers';
import { WebhookEndpoints } from './resources/WebhookEndpoints';
import { Webhooks } from './resources/Webhooks';

export interface ZonelessConfig {
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Zoneless SDK client for interacting with the Zoneless API.
 *
 * @example
 * ```typescript
 * import Zoneless from 'zoneless';
 *
 * const zoneless = new Zoneless('sk_live_z_YOUR_API_KEY', 'https://api.yourdomain.com');
 *
 * // Create an account
 * const account = await zoneless.accounts.create({
 *   country: 'US',
 *   email: 'jenny.rosen@example.com',
 *   controller: {
 *     fees: { payer: 'application' },
 *     losses: { payments: 'application' },
 *     zoneless_dashboard: { type: 'express' },
 *   },
 * });
 * ```
 */
export class Zoneless {
  private readonly client: HttpClient;

  /** Accounts API resource */
  readonly accounts: Accounts;

  /** AccountLinks API resource */
  readonly accountLinks: AccountLinks;

  /** Balance API resource */
  readonly balance: BalanceResource;

  /** BalanceTransactions API resource */
  readonly balanceTransactions: BalanceTransactions;

  /** Checkout API namespace */
  readonly checkout: Checkout;

	/** Customers API resource */
	readonly customers: Customers;

  /** Events API resource */
  readonly events: Events;

  /** LoginLinks API resource */
  readonly loginLinks: LoginLinks;

  /** Payouts API resource */
  readonly payouts: Payouts;

	/** Prices API resource */
	readonly prices: Prices;

	/** Products API resource */
	readonly products: Products;

  /** Subscriptions API resource */
  readonly subscriptions: Subscriptions;

  /** TopUps API resource */
  readonly topups: TopUps;

  /** Transfers API resource */
  readonly transfers: Transfers;

  /** WebhookEndpoints API resource */
  readonly webhookEndpoints: WebhookEndpoints;

  /** Webhooks utility for signature verification */
  readonly webhooks: Webhooks;

  /**
   * Creates a new Zoneless SDK instance.
   *
   * @param apiKey - Your Zoneless API secret key
   * @param baseUrl - The base URL of your Zoneless API instance
   * @param config - Optional configuration options
   */
  constructor(apiKey: string, baseUrl: string, config: ZonelessConfig = {}) {
    if (!apiKey) {
      throw new Error('Zoneless API key is required');
    }
    if (!baseUrl) {
      throw new Error('Zoneless API base URL is required');
    }

    this.client = new HttpClient({
      apiKey,
      baseUrl,
      timeout: config.timeout,
    });

    // Initialize resources
    this.accounts = new Accounts(this.client);
    this.accountLinks = new AccountLinks(this.client);
    this.balance = new BalanceResource(this.client);
    this.balanceTransactions = new BalanceTransactions(this.client);
    this.checkout = new Checkout(this.client);
		this.customers = new Customers(this.client);
    this.events = new Events(this.client);
    this.loginLinks = new LoginLinks(this.client);
    this.payouts = new Payouts(this.client);
		this.prices = new Prices(this.client);
		this.products = new Products(this.client);
    this.subscriptions = new Subscriptions(this.client);
    this.topups = new TopUps(this.client);
    this.transfers = new Transfers(this.client);
    this.webhookEndpoints = new WebhookEndpoints(this.client);
    this.webhooks = new Webhooks();
  }
}

// Default export for convenient usage: import Zoneless from 'zoneless'
export default Zoneless;

// Named exports
export { ZonelessApiError, RequestExtraOptions } from './HttpClient';
export { WebhookSignatureVerificationError } from './resources/Webhooks';
export * from './types';
export * from './schemas';
