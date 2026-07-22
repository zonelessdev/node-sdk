/**
 * Stripe-style range filter used for timestamps and numeric fields
 * (`created`, `amount`, `arrival_date`, etc.).
 */
export interface RangeFilter {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

/**
 * Applies a Stripe-style range filter onto a query object as `field[gt]`,
 * `field[gte]`, `field[lt]`, and `field[lte]`.
 */
export function ApplyDateFilter(
  query: Record<string, string | number | boolean | undefined>,
  field: string,
  filter?: RangeFilter
): void {
  if (!filter) {
    return;
  }
  if (filter.gt !== undefined) {
    query[`${field}[gt]`] = filter.gt;
  }
  if (filter.gte !== undefined) {
    query[`${field}[gte]`] = filter.gte;
  }
  if (filter.lt !== undefined) {
    query[`${field}[lt]`] = filter.lt;
  }
  if (filter.lte !== undefined) {
    query[`${field}[lte]`] = filter.lte;
  }
}
