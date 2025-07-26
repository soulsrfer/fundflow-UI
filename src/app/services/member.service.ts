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

  createMember(member: Member): Observable<ApiResponse<Member>> {
    return this.api.post<ApiResponse<Member>>('member/create', member);
  }

  getAllMembers(): Observable<ApiResponse<Member[]>> {
    return this.api.get<ApiResponse<Member[]>>('member/list');
  }

  updateMember(id:number, member:Member):Observable<ApiResponse<Member[]>> {
    return this.api.put<ApiResponse<Member[]>>(`member/${id}`, member);
  }

  deleteMember(id: number): Observable<ApiResponse<Member>> {
    return this.api.delete<ApiResponse<Member>>(`member/${id}`);
  }
}
