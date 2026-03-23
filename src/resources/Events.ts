import { BaseResource } from './Base';
import { Event } from '../types/Event';
import { ListResponse } from '../types/ApiResponse';
import { ListEventsInput } from '../schemas/EventSchema';

/**
 * @see https://zoneless.com/docs/events
 */
export class Events extends BaseResource {
  /** @see https://zoneless.com/docs/events/retrieve */
  async retrieve(id: string): Promise<Event> {
    return this.client.Get<Event>(`/events/${id}`);
  }

  /** @see https://zoneless.com/docs/events/list */
  async list(params: ListEventsInput = {}): Promise<ListResponse<Event>> {
    const query = this.BuildQuery(params);
    return this.client.Get<ListResponse<Event>>('/events', query);
  }

  private BuildQuery(
    params: ListEventsInput
  ): Record<string, string | number | undefined> {
    const query: Record<string, string | number | undefined> = {
      limit: params.limit,
      starting_after: params.starting_after,
      ending_before: params.ending_before,
      type: params.type,
    };

    // Expand types array to indexed format: types[0], types[1], etc.
    if (params.types) {
      params.types.forEach((eventType, index) => {
        query[`types[${index}]`] = eventType;
      });
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
