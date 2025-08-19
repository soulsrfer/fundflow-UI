import { Injectable } from '@angular/core';
import { ApiResponse } from '@interfaces/api-response.interface';
import { ScheduleEntry } from '@interfaces/schedule-entry.interface';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleEntryService {
  constructor(private api: ApiService) {}

  get endpoint() {
    const base = 'schedule-entries';
    return {
      base,
      create: `${base}/create`,
      byId: (id: number) => `${base}/${id}`,
      delete: (id: number) => `${base}/${id}/delete`,
      update: (id: number) => `${base}/${id}/update`,
    };
  }

  updateEntry(id:number, entry:ScheduleEntry):Observable<ApiResponse<ScheduleEntry>> {
    return this.api.put<ApiResponse<ScheduleEntry>>(this.endpoint.update(id),entry);
  }

  getAllScheduleEntries():Observable<ApiResponse<ScheduleEntry[]>> {
    return this.api.get<ApiResponse<ScheduleEntry[]>>(this.endpoint.base);
  }
}
