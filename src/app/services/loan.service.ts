import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '@interfaces/api-response.interface';
import { Loan } from '@interfaces/loan.interface';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  get endpoint() {
    const base = 'loans';
    return {
      base,
      byId: (id: number) => `${base}/${id}`,
    }
    
  }
  constructor(private api: ApiService) { }

  createLoan(loan: Loan): Observable<ApiResponse<Loan>> {
    return this.api.post<ApiResponse<Loan>>(this.endpoint.base, loan);
  }

  getAllLoans(): Observable<ApiResponse<Loan[]>> {
    return this.api.get<ApiResponse<Loan[]>>(this.endpoint.base);
  }

  updateLoan(id: number, loan: Loan): Observable<ApiResponse<Loan>> {
    return this.api.put<ApiResponse<Loan>>(this.endpoint.byId(id), loan);
  }
  getLoanById(id: number): Observable<ApiResponse<Loan>> {
    return this.api.get<ApiResponse<Loan>>(this.endpoint.byId(id));
  }

  deleteLoan(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<ApiResponse<void>>(this.endpoint.byId(id));
  }

}
