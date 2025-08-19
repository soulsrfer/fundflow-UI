import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Member } from '@interfaces/member.interface';
import { ApiResponse } from '@interfaces/api-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private api: ApiService) { }

  get endpoint() {
    const base = 'member';
    return {
      base,
      create: `${base}/create`,
      list: `${base}/list`,
      byId: (id: number) => `${base}/${id}`,
      update: (id: number) => `${base}/${id}/update`,
      delete: (id: number) => `${base}/${id}/delete`
    };
  }
  
  createMember(member: Member): Observable<ApiResponse<Member>> {
    return this.api.post<ApiResponse<Member>>(this.endpoint.create, member);
  }

  getAllMembers(): Observable<ApiResponse<Member[]>> {
    return this.api.get<ApiResponse<Member[]>>(this.endpoint.list);
  }

  updateMember(id:number, member:Member):Observable<ApiResponse<Member[]>> {
    return this.api.put<ApiResponse<Member[]>>(this.endpoint.byId(id), member);
  }

  deleteMember(id: number): Observable<ApiResponse<Member>> {
    return this.api.delete<ApiResponse<Member>>(this.endpoint.delete(id));
  }
}
