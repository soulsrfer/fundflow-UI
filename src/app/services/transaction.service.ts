import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '@interfaces/api-response.interface';
import { Transaction } from '@interfaces/transaction.interface';
import { HttpParams } from '@angular/common/http';
import { TableResponse } from '@interfaces/table-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private api: ApiService) {}
  get endpoint() {
    const base = 'transactions';
    return {
      base,
      byId: (id: number) => `${base}/${id}`,
    };
  }

  fetchAllTransactions(
    params?: HttpParams
  ): Observable<ApiResponse<TableResponse<Transaction>>> {
    return this.api.get<ApiResponse<any>>(this.endpoint.base, params);
  }
}
