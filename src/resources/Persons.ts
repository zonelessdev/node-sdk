import { BaseResource } from './Base';
import { Person, PersonDeleted } from '../types/Person';
import {
  CreatePersonInput,
  UpdatePersonInput,
  ListPersonsInput,
} from '../schemas/PersonSchema';
import { ListResponse } from '../types/ApiResponse';

/**
 * Persons API resource.
 * Persons represent individuals associated with an account's legal entity.
 * @see https://zoneless.com/docs/persons
 */
export class Persons extends BaseResource {
  /** @see https://zoneless.com/docs/persons/create */
  async create(accountId: string, params: CreatePersonInput = {}): Promise<Person> {
    return this.client.Post<Person>(`/accounts/${accountId}/persons`, params);
  }

  /** @see https://zoneless.com/docs/persons/retrieve */
  async retrieve(accountId: string, personId: string): Promise<Person> {
    return this.client.Get<Person>(`/accounts/${accountId}/persons/${personId}`);
  }

  /** @see https://zoneless.com/docs/persons/update */
  async update(
    accountId: string,
    personId: string,
    params: UpdatePersonInput
  ): Promise<Person> {
    return this.client.Post<Person>(
      `/accounts/${accountId}/persons/${personId}`,
      params
    );
  }

  /** @see https://zoneless.com/docs/persons/delete */
  async del(accountId: string, personId: string): Promise<PersonDeleted> {
    return this.client.Delete<PersonDeleted>(
      `/accounts/${accountId}/persons/${personId}`
    );
  }

  /** @see https://zoneless.com/docs/persons/list */
  async list(
    accountId: string,
    params: ListPersonsInput = {}
  ): Promise<ListResponse<Person>> {
    const query: Record<string, string | number | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
    };

    // Add relationship filters with bracket notation (convert booleans to strings)
    if (params.relationship) {
      if (params.relationship.authorizer !== undefined) {
        query['relationship[authorizer]'] = String(params.relationship.authorizer);
      }
      if (params.relationship.director !== undefined) {
        query['relationship[director]'] = String(params.relationship.director);
      }
      if (params.relationship.executive !== undefined) {
        query['relationship[executive]'] = String(params.relationship.executive);
      }
      if (params.relationship.legal_guardian !== undefined) {
        query['relationship[legal_guardian]'] = String(params.relationship.legal_guardian);
      }
      if (params.relationship.owner !== undefined) {
        query['relationship[owner]'] = String(params.relationship.owner);
      }
      if (params.relationship.representative !== undefined) {
        query['relationship[representative]'] = String(params.relationship.representative);
      }
    }

    return this.client.Get<ListResponse<Person>>(
      `/accounts/${accountId}/persons`,
      query
    );
  }
}
