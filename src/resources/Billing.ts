import { BaseResource } from './Base';
import { BillingMonitorStatus, BillingRun } from '../types/Billing';
import { RunBillingForPlatformInput } from '../schemas/BillingSchema';

/**
 * Zoneless billing helpers for recurring subscription collection.
 *
 * Prefer calling `runForPlatform` from your host cron / Cloud Scheduler.
 * The operator-scoped `POST /v1/billing/run` endpoint is intentionally not
 * exposed here — it requires a special operator key.
 *
 * @zoneless_extension
 * @see https://zoneless.com/docs/billing
 */
export class Billing extends BaseResource {
  /**
   * Run one billing pass for the authenticated platform: process due renewals
   * and invoice retries.
   *
   * @see https://zoneless.com/docs/billing/run_for_platform
   */
  async runForPlatform(
    params: RunBillingForPlatformInput = {}
  ): Promise<BillingRun> {
    return this.client.Post<BillingRun>('/billing/run_for_platform', params);
  }

  /**
   * Get the status of the in-process billing monitor on this API instance.
   *
   * The monitor is disabled by default for multi-instance deployments; prefer
   * `runForPlatform` via cron / Cloud Scheduler instead.
   *
   * @see https://zoneless.com/docs/billing/monitor/status
   */
  async monitorStatus(): Promise<BillingMonitorStatus> {
    return this.client.Get<BillingMonitorStatus>('/billing/monitor/status');
  }
}
