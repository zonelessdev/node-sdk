import { BaseResource } from './Base';
import { Product, ProductDeleted } from '../types/Product';
import {
  CreateProductInput,
	UpdateProductInput,
	ListProductsInput,
} from '../schemas/ProductSchema';
import { ListResponse } from '../types/ApiResponse';

/**
 * @see https://zoneless.com/docs/products
 */
export class Products extends BaseResource {

  /** @see https://zoneless.com/docs/products/create */
  async create(params: CreateProductInput): Promise<Product> {
    return this.client.Post<Product>('/products', params);
  }

	/** @see https://zoneless.com/docs/products/update */
	async update(id: string, params: UpdateProductInput): Promise<Product> {
		return this.client.Post<Product>(`/products/${id}`, params);
	}

	/** @see https://zoneless.com/docs/products/retrieve */
	async retrieve(id: string): Promise<Product> {
		return this.client.Get<Product>(`/products/${id}`);
	}

	/** @see https://zoneless.com/docs/products/delete */
	async del(id:string): Promise<ProductDeleted> {
		return this.client.Delete<ProductDeleted>(`/products/${id}`);
	}

	/** @see https://zoneless.com/docs/products/list */
  async list(
    params: ListProductsInput = {}
  ): Promise<ListResponse<Product>> {
		let query : Record<string, any> = {
			limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      active: params.active,
      shippable: params.shippable,
      ids: params.ids,
      url: params.url,
		};
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
    return this.client.Get<ListResponse<Product>>(
      `/products`,
      query
    );
  }
}
