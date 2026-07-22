import { BaseResource } from './Base';
import { Charge } from '../types/Charge';
import {
  CaptureChargeInput,
  CreateChargeInput,
  ListChargesInput,
  RetrieveChargeInput,
  UpdateChargeInput,
} from '../schemas/ChargeSchema';
import { ListResponse } from '../types/ApiResponse';
import { ApplyDateFilter } from '../utils';

/**
 * @see https://zoneless.com/docs/charges
 */
export class Charges extends BaseResource {
  /** @see https://zoneless.com/docs/charges/create */
  async create(params: CreateChargeInput): Promise<Charge> {
    return this.client.Post<Charge>('/charges', params);
  }

  /** @see https://zoneless.com/docs/charges/update */
  async update(id: string, params: UpdateChargeInput): Promise<Charge> {
    return this.client.Post<Charge>(`/charges/${id}`, params);
  }

  /** @see https://zoneless.com/docs/charges/retrieve */
  async retrieve(
    id: string,
    params: RetrieveChargeInput = {}
  ): Promise<Charge> {
    return this.client.Get<Charge>(`/charges/${id}`, params);
  }

  /** @see https://zoneless.com/docs/charges/list */
  async list(params: ListChargesInput = {}): Promise<ListResponse<Charge>> {
    return this.client.Get<ListResponse<Charge>>(
      '/charges',
      this.BuildQuery(params)
    );
  }

  /**
   * Capture the payment of an existing, uncaptured charge.
   * @see https://zoneless.com/docs/charges/capture
   */
  async capture(
    id: string,
    params: CaptureChargeInput = {}
  ): Promise<Charge> {
    return this.client.Post<Charge>(`/charges/${id}/capture`, params);
  }

  private BuildQuery(
    params: ListChargesInput
  ): Record<string, string | number | boolean | undefined> {
    const query: Record<string, string | number | boolean | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      customer: params.customer,
      payment_intent: params.payment_intent,
      transfer_group: params.transfer_group,
    };

    ApplyDateFilter(query, 'created', params.created);

    return query;
  }
}
