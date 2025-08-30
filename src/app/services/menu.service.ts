import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { UserMenu } from '@interfaces/user-menu.interface';
import { ApiResponse } from '@interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  model: MenuItem[] = [];

  get endpoint() {
    const base = 'menu';
    return {
      base,
      byId: (id: string) => `${base}/${id}`,
      create: `${base}/create`,
      delete: (id: string) => `${base}/delete/${id}`,
      update: (id: string) => `${base}/update/${id}`,
      roles: `${base}/roles`,
      list: `${base}/list`,
    };
  }

  constructor(private api: ApiService) {}

  getUserMenu(): Observable<ApiResponse<MenuItem[]>> {
    return this.api.get<ApiResponse<MenuItem[]>>('menu');
  }

  getAllMenuItems(): Observable<ApiResponse<UserMenu[]>> {
    return this.api.get<ApiResponse<UserMenu[]>>(this.endpoint.list);
  }

  createMenuItem(menuItem: UserMenu): Observable<ApiResponse<UserMenu>> {
    return this.api.post<ApiResponse<UserMenu>>(this.endpoint.create, menuItem);
  }

  deleteMenuItem(id: string): Observable<ApiResponse<UserMenu>> {
    return this.api.delete<ApiResponse<UserMenu>>(this.endpoint.delete(id));
  }

  updateMenuItem(
    id: string,
    menuItem: UserMenu
  ): Observable<ApiResponse<UserMenu>> {
    return this.api.put<ApiResponse<UserMenu>>(this.endpoint.update(id), menuItem);
  }

  getRoleOptions(): Observable<ApiResponse<string[]>> {
    return this.api.get<ApiResponse<string[]>>(this.endpoint.roles);
  }
}
