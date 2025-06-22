export class Paginated<T> {
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    first: string;
    last: string;
    prev: string;
    current: string;
    next: string;
  };
  data: T[];
}
