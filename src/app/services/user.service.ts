import { Injectable } from '@angular/core';
import { ApiResponse } from '@interfaces/api-response.interface';
import { User } from '@interfaces/user.interface';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { TableResponse } from '@interfaces/table-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  get endpoint() {
    const base = 'users';
    return {
      base,
      byId: (id: number) => `${base}/${id}`,
      register: `${base}/register`,
    };
  }
  constructor(private api: ApiService) {}

  createUser(user: User): Observable<ApiResponse<User>> {
    return this.api.post<ApiResponse<User>>(this.endpoint.register, user);
  }

  loadUser(id: number): Observable<ApiResponse<User>> {
    return this.api.get<ApiResponse<User>>(this.endpoint.byId(id));
  }
  
  updateUser(id: number, user: User): Observable<ApiResponse<User>> {
    return this.api.put<ApiResponse<User>>(this.endpoint.byId(id), user);
  }

  getAllUsers(params?: HttpParams): Observable<ApiResponse<TableResponse<User>>> {
    return this.api.get<ApiResponse<TableResponse<User>>>(this.endpoint.base, params);
  }
}
