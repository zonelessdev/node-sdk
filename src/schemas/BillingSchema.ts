import { z } from 'zod';

/**
 * Schema for triggering a platform-scoped subscription billing run.
 * Processes due renewals and invoice retries for the authenticated platform.
 *
 * @zoneless_extension
 * @see https://zoneless.com/docs/billing/run_for_platform
 */
export const RunBillingForPlatformSchema = z.object({
  /**
   * Maximum number of subscriptions to process in this pass.
   * Defaults to the API's configured batch size when omitted.
   */
  batch_size: z.number().int().positive().optional(),
});

export type RunBillingForPlatformInput = z.infer<
  typeof RunBillingForPlatformSchema
>;
