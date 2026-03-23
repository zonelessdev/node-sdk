import { Keypair, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { BaseResource } from './Base';
import { RequestExtraOptions } from '../HttpClient';
import {
  Payout,
  PayoutBatchBuildResponse,
  PayoutBatchBroadcastResponse,
  ProcessPendingResult,
} from '../types/Payout';
import {
  CreatePayoutInput,
  UpdatePayoutInput,
  ListPayoutsInput,
  BuildPayoutsBatchInput,
  BroadcastPayoutsBatchInput,
} from '../schemas/PayoutSchema';
import { ListResponse } from '../types/ApiResponse';

/**
 * @see https://zoneless.com/docs/payouts
 */
export class Payouts extends BaseResource {
  /** @see https://zoneless.com/docs/payouts/create */
  async create(
    params: CreatePayoutInput,
    options?: RequestExtraOptions
  ): Promise<Payout> {
    return this.client.Post<Payout>('/payouts', params, options);
  }

  /** @see https://zoneless.com/docs/payouts/retrieve */
  async retrieve(id: string, options?: RequestExtraOptions): Promise<Payout> {
    return this.client.Get<Payout>(`/payouts/${id}`, undefined, options);
  }

  /** @see https://zoneless.com/docs/payouts/update */
  async update(
    id: string,
    params: UpdatePayoutInput,
    options?: RequestExtraOptions
  ): Promise<Payout> {
    return this.client.Post<Payout>(`/payouts/${id}`, params, options);
  }

  /** @see https://zoneless.com/docs/payouts/list */
  async list(
    params: ListPayoutsInput = {},
    options?: RequestExtraOptions
  ): Promise<ListResponse<Payout>> {
    const query = this.BuildQuery(params);
    return this.client.Get<ListResponse<Payout>>('/payouts', query, options);
  }

  /** @see https://zoneless.com/docs/payouts/cancel */
  async cancel(id: string, options?: RequestExtraOptions): Promise<Payout> {
    return this.client.Post<Payout>(`/payouts/${id}/cancel`, {}, options);
  }

  /**
   * Build an unsigned batch payout transaction for multiple pending payouts.
   * This enables self-custodial payouts where the platform signs transactions locally.
   *
   * @param params - Object containing array of payout IDs to include
   * @param options - Optional request options
   * @returns Unsigned transaction data ready for signing
   *
   * @example
   * ```typescript
   * const buildResult = await zoneless.payouts.build({
   *   payouts: ['po_z123', 'po_z456', 'po_z789']
   * });
   * console.log(buildResult.unsigned_transaction); // Base64 transaction
   * ```
   *
   * @see https://zoneless.com/docs/payouts/build
   */
  async build(
    params: BuildPayoutsBatchInput,
    options?: RequestExtraOptions
  ): Promise<PayoutBatchBuildResponse> {
    return this.client.Post<PayoutBatchBuildResponse>(
      '/payouts/build',
      params,
      options
    );
  }

  /**
   * Broadcast a signed batch payout transaction to the Solana network.
   * Updates all included payouts to 'paid' or 'failed' status.
   *
   * @param params - Object containing the signed transaction and payout IDs
   * @param options - Optional request options
   * @returns Broadcast result with transaction signature and updated payouts
   *
   * @example
   * ```typescript
   * const result = await zoneless.payouts.broadcast({
   *   signed_transaction: signedTxBase64,
   *   payouts: ['po_z123', 'po_z456', 'po_z789']
   * });
   * console.log(result.signature); // Solana transaction signature
   * ```
   *
   * @see https://zoneless.com/docs/payouts/broadcast
   */
  async broadcast(
    params: BroadcastPayoutsBatchInput,
    options?: RequestExtraOptions
  ): Promise<PayoutBatchBroadcastResponse> {
    return this.client.Post<PayoutBatchBroadcastResponse>(
      '/payouts/broadcast',
      params,
      options
    );
  }

  /**
   * Process a single batch of pending payouts (up to 10).
   * This is the lower-level method that orchestrates:
   * 1. Fetches pending payouts (up to 10)
   * 2. Builds an unsigned transaction
   * 3. Signs it locally using the provided secret key
   * 4. Broadcasts the signed transaction
   *
   * Use `processAll` to automatically process all pending payouts.
   *
   * @param secretKey - Your platform's Solana secret key (base58 encoded)
   * @param options - Optional configuration
   * @param options.limit - Maximum number of payouts to process (default: 10, max: 10)
   * @param options.requestOptions - Additional request options
   * @returns Result containing transaction signature, processed payouts, and has_more flag
   *
   * @example
   * ```typescript
   * const result = await zoneless.payouts.processBatch(
   *   process.env.SOLANA_SECRET_KEY
   * );
   * console.log(`Processed ${result.payouts.length} payouts`);
   * if (result.has_more) {
   *   console.log('More payouts pending...');
   * }
   * ```
   *
   * @see https://zoneless.com/docs/payouts/process-batch
   */
  async processBatch(
    secretKey: string,
    options?: {
      limit?: number;
      requestOptions?: RequestExtraOptions;
    }
  ): Promise<ProcessPendingResult> {
    const limit = Math.min(options?.limit ?? 10, 10);
    const requestOptions = options?.requestOptions;

    // Step 1: Get pending payouts
    const pendingPayouts = await this.list(
      { status: 'pending', limit },
      requestOptions
    );

    if (pendingPayouts.data.length === 0) {
      return {
        signature: '',
        status: 'paid',
        viewer_url: '',
        payouts: [],
        total_amount: 0,
        has_more: false,
      };
    }

    const payoutIds = pendingPayouts.data.map((p) => p.id);

    // Step 2: Build the unsigned transaction
    const buildResult = await this.build({ payouts: payoutIds }, requestOptions);

    // Step 3: Sign the transaction locally
    const signedTransaction = this.SignTransaction(
      buildResult.unsigned_transaction,
      secretKey
    );

    // Step 4: Broadcast the signed transaction (pass blockhash to avoid redundant RPC call)
    const broadcastResult = await this.broadcast(
      {
        signed_transaction: signedTransaction,
        payouts: payoutIds,
        blockhash: buildResult.blockhash,
        last_valid_block_height: buildResult.last_valid_block_height,
      },
      requestOptions
    );

    return {
      signature: broadcastResult.signature,
      status: broadcastResult.status,
      viewer_url: broadcastResult.viewer_url,
      payouts: broadcastResult.payouts,
      total_amount: buildResult.total_amount,
      has_more: pendingPayouts.has_more,
      failure_message: broadcastResult.failure_message,
    };
  }

  /**
   * Process all pending payouts, automatically handling multiple batches.
   * Loops through all pending payouts in batches of up to 10 until none remain.
   *
   * @param secretKey - Your platform's Solana secret key (base58 encoded)
   * @param options - Optional request options
   * @returns Array of results, one per batch processed
   *
   * @example
   * ```typescript
   * const results = await zoneless.payouts.processAll(
   *   process.env.SOLANA_SECRET_KEY
   * );
   * const totalProcessed = results.reduce((sum, r) => sum + r.payouts.length, 0);
   * console.log(`Processed ${totalProcessed} payouts in ${results.length} batches`);
   * ```
   *
   * @see https://zoneless.com/docs/payouts/process-all
   */
  async processAll(
    secretKey: string,
    options?: RequestExtraOptions & { delayBetweenBatchesMs?: number }
  ): Promise<ProcessPendingResult[]> {
    const results: ProcessPendingResult[] = [];
    const delayMs = options?.delayBetweenBatchesMs ?? 2000;
    let hasMore = true;

    while (hasMore) {
      const result = await this.processBatch(secretKey, { requestOptions: options });

      if (result.payouts.length > 0) {
        results.push(result);
      }

      hasMore = result.has_more;

      if (hasMore && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  /**
   * Sign an unsigned transaction locally using a Solana secret key.
   * Use this after calling `build()` to sign the transaction before broadcasting.
   *
   * @param unsignedTransaction - Base64-encoded unsigned transaction from `build()`
   * @param secretKey - Solana secret key (base58 encoded)
   * @returns Base64-encoded signed transaction ready for `broadcast()`
   *
   * @example
   * ```typescript
   * const buildResult = await zoneless.payouts.build({
   *   payouts: ['po_z123', 'po_z456']
   * });
   * const signedTx = zoneless.payouts.sign(
   *   buildResult.unsigned_transaction,
   *   process.env.SOLANA_SECRET_KEY
   * );
   * const result = await zoneless.payouts.broadcast({
   *   signed_transaction: signedTx,
   *   payouts: ['po_z123', 'po_z456']
   * });
   * ```
   *
   * @see https://zoneless.com/docs/payouts/sign
   */
  sign(unsignedTransaction: string, secretKey: string): string {
    return this.SignTransaction(unsignedTransaction, secretKey);
  }

  /**
   * Sign a transaction locally using a Solana secret key.
   *
   * @param unsignedTransaction - Base64-encoded unsigned transaction
   * @param secretKey - Solana secret key (base58 encoded)
   * @returns Base64-encoded signed transaction
   */
  private SignTransaction(
    unsignedTransaction: string,
    secretKey: string
  ): string {
    const keypair = Keypair.fromSecretKey(bs58.decode(secretKey));
    const txBuffer = Buffer.from(unsignedTransaction, 'base64');
    const transaction = Transaction.from(txBuffer);
    transaction.partialSign(keypair);
    return transaction.serialize().toString('base64');
  }

  private BuildQuery(
    params: ListPayoutsInput
  ): Record<string, string | number | undefined> {
    const query: Record<string, string | number | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      destination: params.destination,
      status: params.status,
    };

    if (params.arrival_date) {
      if (params.arrival_date.gt !== undefined) {
        query['arrival_date[gt]'] = params.arrival_date.gt;
      }
      if (params.arrival_date.gte !== undefined) {
        query['arrival_date[gte]'] = params.arrival_date.gte;
      }
      if (params.arrival_date.lt !== undefined) {
        query['arrival_date[lt]'] = params.arrival_date.lt;
      }
      if (params.arrival_date.lte !== undefined) {
        query['arrival_date[lte]'] = params.arrival_date.lte;
      }
    }

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
