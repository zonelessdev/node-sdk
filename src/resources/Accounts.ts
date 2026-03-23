import { BaseResource } from './Base';
import { RequestExtraOptions } from '../HttpClient';
import { Account, AccountDeletedResponse } from '../types/Account';
import {
  CreateAccountInput,
  UpdateAccountInput,
  ListAccountsInput,
  RejectAccountInput,
} from '../schemas/AccountSchema';
import { ListResponse } from '../types/ApiResponse';
import { ExternalWallet } from '../types/ExternalWallet';
import {
  CreateExternalWalletInput,
  UpdateExternalWalletInput,
  ListExternalWalletsInput,
} from '../schemas/ExternalWalletSchema';
import {
  ExternalAccounts,
  ExternalWalletDeletedResponse,
} from './ExternalAccounts';
import { Person, PersonDeleted } from '../types/Person';
import {
  CreatePersonInput,
  UpdatePersonInput,
  ListPersonsInput,
} from '../schemas/PersonSchema';
import { Persons } from './Persons';
import { LoginLinks } from './LoginLinks';
import { LoginLink } from '../types/LoginLink';

/**
 * @see https://zoneless.com/docs/accounts
 */
export class Accounts extends BaseResource {
  private readonly externalAccounts: ExternalAccounts;
  private readonly persons: Persons;
  private readonly loginLinks: LoginLinks;

  constructor(client: InstanceType<typeof BaseResource>['client']) {
    super(client);
    this.externalAccounts = new ExternalAccounts(client);
    this.persons = new Persons(client);
    this.loginLinks = new LoginLinks(client);
  }

  /** @see https://zoneless.com/docs/accounts/create */
  async create(
    params: CreateAccountInput = {},
    options?: RequestExtraOptions
  ): Promise<Account> {
    return this.client.Post<Account>('/accounts', params, options);
  }

  /** @see https://zoneless.com/docs/accounts/retrieve */
  async retrieve(id: string, options?: RequestExtraOptions): Promise<Account> {
    return this.client.Get<Account>(`/accounts/${id}`, undefined, options);
  }

  /** @see https://zoneless.com/docs/accounts/retrieve */
  async retrieveMe(options?: RequestExtraOptions): Promise<Account> {
    return this.client.Get<Account>('/accounts/me', undefined, options);
  }

  /** @see https://zoneless.com/docs/accounts/update */
  async update(
    id: string,
    params: UpdateAccountInput,
    options?: RequestExtraOptions
  ): Promise<Account> {
    return this.client.Post<Account>(`/accounts/${id}`, params, options);
  }

  /** @see https://zoneless.com/docs/accounts/delete */
  async del(
    id: string,
    options?: RequestExtraOptions
  ): Promise<AccountDeletedResponse> {
    return this.client.Delete<AccountDeletedResponse>(
      `/accounts/${id}`,
      options
    );
  }

  /** @see https://zoneless.com/docs/accounts/list */
  async list(
    params: ListAccountsInput = {},
    options?: RequestExtraOptions
  ): Promise<ListResponse<Account>> {
    const query: Record<string, string | number | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
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

    return this.client.Get<ListResponse<Account>>('/accounts', query, options);
  }

  /** @see https://zoneless.com/docs/accounts/reject */
  async reject(
    id: string,
    params: RejectAccountInput,
    options?: RequestExtraOptions
  ): Promise<Account> {
    return this.client.Post<Account>(`/accounts/${id}/reject`, params, options);
  }

  // ============================================
  // External Accounts (Wallets)
  // ============================================

  /** @see https://zoneless.com/docs/external-wallets/create */
  async createExternalAccount(
    accountId: string,
    params: CreateExternalWalletInput
  ): Promise<ExternalWallet> {
    return this.externalAccounts.create(accountId, params);
  }

  /** @see https://zoneless.com/docs/external-wallets/retrieve */
  async retrieveExternalAccount(
    accountId: string,
    externalAccountId: string
  ): Promise<ExternalWallet> {
    return this.externalAccounts.retrieve(accountId, externalAccountId);
  }

  /** @see https://zoneless.com/docs/external-wallets/update */
  async updateExternalAccount(
    accountId: string,
    externalAccountId: string,
    params: UpdateExternalWalletInput
  ): Promise<ExternalWallet> {
    return this.externalAccounts.update(accountId, externalAccountId, params);
  }

  /** @see https://zoneless.com/docs/external-wallets/delete */
  async deleteExternalAccount(
    accountId: string,
    externalAccountId: string
  ): Promise<ExternalWalletDeletedResponse> {
    return this.externalAccounts.del(accountId, externalAccountId);
  }

  /** @see https://zoneless.com/docs/external-wallets/list */
  async listExternalAccounts(
    accountId: string,
    params: ListExternalWalletsInput = {}
  ): Promise<ListResponse<ExternalWallet>> {
    return this.externalAccounts.list(accountId, params);
  }

  // ============================================
  // Persons
  // ============================================

  /** @see https://zoneless.com/docs/persons/create */
  async createPerson(
    accountId: string,
    params: CreatePersonInput = {}
  ): Promise<Person> {
    return this.persons.create(accountId, params);
  }

  /** @see https://zoneless.com/docs/persons/retrieve */
  async retrievePerson(accountId: string, personId: string): Promise<Person> {
    return this.persons.retrieve(accountId, personId);
  }

  /** @see https://zoneless.com/docs/persons/update */
  async updatePerson(
    accountId: string,
    personId: string,
    params: UpdatePersonInput
  ): Promise<Person> {
    return this.persons.update(accountId, personId, params);
  }

  /** @see https://zoneless.com/docs/persons/delete */
  async deletePerson(
    accountId: string,
    personId: string
  ): Promise<PersonDeleted> {
    return this.persons.del(accountId, personId);
  }

  /** @see https://zoneless.com/docs/persons/list */
  async listPersons(
    accountId: string,
    params: ListPersonsInput = {}
  ): Promise<ListResponse<Person>> {
    return this.persons.list(accountId, params);
  }

  // ============================================
  // Login Links
  // ============================================

  /** @see https://zoneless.com/docs/login-links/create */
  async createLoginLink(accountId: string): Promise<LoginLink> {
    return this.loginLinks.create(accountId);
  }
}
