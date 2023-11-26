import { ParsedUrlQuery } from 'querystring';

export interface PageRequest extends ParsedUrlQuery {
  page?: string;
  count?: string;
  query?: string;
}
