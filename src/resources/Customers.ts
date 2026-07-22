import { BaseResource } from './Base';
import { Customer, CustomerDeleted } from '../types/Customer';
import {
  CreateCustomerInput,
	UpdateCustomerInput,
	ListCustomersInput,
	RetrieveCustomerInput
} from '../schemas/CustomerSchema';
import { ListResponse } from '../types/ApiResponse';
import { ApplyDateFilter } from '../utils';

/**
 * @see https://zoneless.com/docs/customers
 */
export class Customers extends BaseResource {

  /** @see https://zoneless.com/docs/customers/create */
  async create(params: CreateCustomerInput): Promise<Customer> {
    return this.client.Post<Customer>('/customers', params);
  }

	/** @see https://zoneless.com/docs/customers/update */
	async update(id: string, params: UpdateCustomerInput): Promise<Customer> {
		return this.client.Post<Customer>(`/customers/${id}`, params);
	}

	/** @see https://zoneless.com/docs/customers/retrieve */
	async retrieve(id: string, params: RetrieveCustomerInput = {}): Promise<Customer> {
		return this.client.Get<Customer>(`/customers/${id}`, params);
	}

	/** @see https://zoneless.com/docs/customers/list */
  async list(
    params: ListCustomersInput = {}
  ): Promise<ListResponse<Customer>> {
		let query : Record<string, any> = {
			limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      email: params.email,
		};
		ApplyDateFilter(query, 'created', params.created);
    return this.client.Get<ListResponse<Customer>>(
      `/customers`,
      query
    );
  }

	/** @see https://zoneless.com/docs/customers/delete */
	async del(customerId: string): Promise<CustomerDeleted> {
		return this.client.Delete<CustomerDeleted>(
			`/customers/${customerId}`
		);
	}
}
