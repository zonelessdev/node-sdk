import { BaseResource } from './Base';
import { PaymentLink } from '../types/PaymentLink';
import { CheckoutSessionLineItem } from '../types/CheckoutSession';
import {
  CreatePaymentLinkInput,
  ListPaymentLinkLineItemsInput,
  ListPaymentLinksInput,
  RetrievePaymentLinkInput,
  UpdatePaymentLinkInput,
} from '../schemas/PaymentLinkSchema';
import { ListResponse } from '../types/ApiResponse';

/**
 * @see https://zoneless.com/docs/payment_links
 */
export class PaymentLinks extends BaseResource {
  /** @see https://zoneless.com/docs/payment_links/create */
  async create(params: CreatePaymentLinkInput): Promise<PaymentLink> {
    return this.client.Post<PaymentLink>('/payment_links', params);
  }

  /** @see https://zoneless.com/docs/payment_links/update */
  async update(
    id: string,
    params: UpdatePaymentLinkInput
  ): Promise<PaymentLink> {
    return this.client.Post<PaymentLink>(`/payment_links/${id}`, params);
  }

  /** @see https://zoneless.com/docs/payment_links/retrieve */
  async retrieve(
    id: string,
    params: RetrievePaymentLinkInput = {}
  ): Promise<PaymentLink> {
    return this.client.Get<PaymentLink>(`/payment_links/${id}`, params);
  }

  /** @see https://zoneless.com/docs/payment_links/list */
  async list(
    params: ListPaymentLinksInput = {}
  ): Promise<ListResponse<PaymentLink>> {
    return this.client.Get<ListResponse<PaymentLink>>(
      '/payment_links',
      this.BuildQuery(params)
    );
  }

  /**
   * When retrieving a payment link, you can optionally retrieve information
   * about the line items with `expand[]=line_items`. You can also retrieve
   * them separately with this method.
   * @see https://zoneless.com/docs/payment_links/line_items
   */
  async listLineItems(
    id: string,
    params: ListPaymentLinkLineItemsInput = {}
  ): Promise<ListResponse<CheckoutSessionLineItem>> {
    return this.client.Get<ListResponse<CheckoutSessionLineItem>>(
      `/payment_links/${id}/line_items`,
      params
    );
  }

  private BuildQuery(
    params: ListPaymentLinksInput
  ): Record<string, string | number | boolean | undefined> {
    return {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      active: params.active,
    };
  }
}
