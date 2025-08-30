import { Injectable } from '@angular/core';
import { ApiResponse } from '@interfaces/api-response.interface';
import { Contribution } from '@interfaces/contribution.interface';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { TableResponse } from '@interfaces/table-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  constructor(private api: ApiService) { }
  get endpoint() {
    const base = 'contributions';
    return {
      base,
      byId: (id: number) => `${base}/${id}`,
    };
  }

  createContribution(contribution: Contribution): Observable<ApiResponse<Contribution>> {
    return this.api.post<ApiResponse<Contribution>>(this.endpoint.base, contribution);
  }

  getAllContributions(params?: HttpParams):Observable<ApiResponse<TableResponse<Contribution>>> {
    return this.api.get<ApiResponse<TableResponse<Contribution>>>(this.endpoint.base, params);
  }

  updateContribution(id: number, payload:Contribution):Observable<ApiResponse<Contribution>> {
    return this.api.put<ApiResponse<Contribution>>(this.endpoint.byId(id), payload);
  }

  deleteContribution(id: number):Observable<ApiResponse<Contribution>> {
    return this.api.delete<ApiResponse<Contribution>>(this.endpoint.byId(id));
  }
}
