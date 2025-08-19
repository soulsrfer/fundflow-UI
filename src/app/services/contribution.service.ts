import { Injectable } from '@angular/core';
import { ApiResponse } from '@interfaces/api-response.interface';
import { Contribution } from '@interfaces/contribution.interface';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  constructor(private api: ApiService) { }
  get endpoint() {
    const base = 'contributions';
    return {
      base,
      create: `${base}/create`,
      byId: (id: number) => `${base}/${id}`,
      update: (id: number) => `${base}/${id}/update`,
      delete: (id: number) => `${base}/${id}/delete`
    };
  }

  createContribution(contribution: Contribution): Observable<ApiResponse<Contribution>> {
    return this.api.post<ApiResponse<Contribution>>(this.endpoint.create, contribution);
  }

  getAllContributions():Observable<ApiResponse<Contribution[]>> {
    return this.api.get<ApiResponse<Contribution[]>>(this.endpoint.base);
  }

  updateContribution(id: number, payload:Contribution):Observable<ApiResponse<Contribution>> {
    return this.api.put<ApiResponse<Contribution>>(this.endpoint.update(id), payload);
  }

  deleteContribution(id: number):Observable<ApiResponse<Contribution>> {
    return this.api.delete<ApiResponse<Contribution>>(this.endpoint.delete(id));
  }
}
