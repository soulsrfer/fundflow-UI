import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { UserMenu } from '@interfaces/user-menu.interface';
import { ApiResponse } from '@interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
    model: MenuItem[] = [];
  
  constructor(private api: ApiService) {}

  getUserMenu(): Observable<ApiResponse<MenuItem[]>> {
    return this.api.get<ApiResponse<MenuItem[]>>('menu');
  }

  getAllMenuItems(): Observable<ApiResponse<UserMenu[]>> {
    return this.api.get<ApiResponse<UserMenu[]>>('menu/list');
  }

  createMenuItem(menuItem: UserMenu): Observable<ApiResponse<UserMenu>> {
    return this.api.post<ApiResponse<UserMenu>>('menu/create', menuItem);
  }

  deleteMenuItem(id: string): Observable<ApiResponse<UserMenu>> {
    return this.api.delete<ApiResponse<UserMenu>>(`menu/delete/${id}`);
  }

  updateMenuItem(id: string, menuItem: UserMenu): Observable<ApiResponse<UserMenu>> {
    return this.api.put<ApiResponse<UserMenu>>(`menu/update/${id}`, menuItem);
  }
}
