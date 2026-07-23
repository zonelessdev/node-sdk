/**
 * Zoneless subscription billing helpers.
 *
 * Used to poll for subscriptions that need to recur and create cycle invoices.
 * Not a Stripe public API — Zoneless extension for self-hosted platforms.
 *
 * @zoneless_extension
 */

/** A per-subscription error from a billing run. */
export interface BillingRunError {
  /** Subscription ID that failed. */
  subscription: string;
  /** Error message. */
  error: string;
}

/**
 * Response from POST /v1/billing/run_for_platform.
 * Summarizes one billing pass for the authenticated platform.
 */
export interface BillingRun {
  object: 'billing.run';
  /** Total subscriptions considered in this pass. */
  processed: number;
  /** Subscriptions successfully invoiced / collected. */
  succeeded: number;
  /** Subscriptions that failed during processing. */
  failed: number;
  /** Subscriptions skipped (e.g. locked or not due). */
  skipped: number;
  /** Per-subscription failure details. */
  errors: BillingRunError[];
}

/**
 * Response from GET /v1/billing/monitor/status.
 * Reports whether the in-process billing monitor is enabled and running.
 */
export interface BillingMonitorStatus {
  /** True when the in-process monitor loop is active on this API instance. */
  running: boolean;
  /** True when BILLING_MONITOR_ENABLED is set on the API instance. */
  enabled: boolean;
  /** Configured poll interval in milliseconds. */
  poll_interval_ms: number;
  /** Platform account the request was authenticated as. */
  platform_account: string;
}
