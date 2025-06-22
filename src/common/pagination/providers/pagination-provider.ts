import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T>(
    query: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const result = await repository.find({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    const baseURL = this.request.protocol + '://' + this.request.get('host');
    const newURL = new URL(this.request.url, baseURL);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / query.limit);
    const nestPage = query.page == totalPages ? totalPages : query.page + 1;
    const previousPage = query.page == 1 ? 1 : query.page - 1;

    const finalResult: Paginated<T> = {
      meta: {
        itemsPerPage: query.limit,
        totalItems,
        currentPage: query.page,
        totalPages,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${query.limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${query.limit}&page=${totalPages}`,
        prev: `${newURL.origin}${newURL.pathname}?limit=${query.limit}&page=${previousPage}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${query.limit}&page=${query.page}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${query.limit}&page=${nestPage}`,
      },
      data: result,
    };
    return finalResult;
  }
}
