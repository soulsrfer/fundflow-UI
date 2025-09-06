import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Member } from '@interfaces/member.interface';
import { ApiResponse } from '@interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { TableResponse } from '@interfaces/table-response.interface';
import { HttpParams, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private api: ApiService) { }

  get endpoint() {
    const base = 'members';
    return {
      base,
      byId: (id: number) => `${base}/${id}`,
    };
  }
  
  createMember(member: Member): Observable<ApiResponse<Member>> {
    return this.api.post<ApiResponse<Member>>(this.endpoint.base, member);
  }

  getAllMembers(params?: HttpParams): Observable<ApiResponse<TableResponse<Member>>> {
    return this.api.get<ApiResponse<TableResponse<Member>>>(this.endpoint.base, params);
  }

  updateMember(id:number, member:Member):Observable<ApiResponse<Member[]>> {
    return this.api.put<ApiResponse<Member[]>>(this.endpoint.byId(id), member);
  }

  deleteMember(id: number): Observable<ApiResponse<Member>> {
    return this.api.delete<ApiResponse<Member>>(this.endpoint.byId(id));
  }

  patchActive(id: number, active: boolean): Observable<ApiResponse<Member>>{
    return this.api.patch<ApiResponse<Member>>(this.endpoint.byId(id), {active});
  }
}
