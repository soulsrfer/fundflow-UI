import { computed, Injectable, signal } from '@angular/core';

interface DrawerState {
  userMenuActive: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  _state: DrawerState = {
    userMenuActive: false,
  };
  drawerState = signal<DrawerState>(this._state);
  
  isUserMenuActive = computed<boolean>(
    () => this.drawerState().userMenuActive ?? false
  );
  constructor() {}

  toggleUserMenu() {
    this.drawerState.update((prev) => ({
      ...prev,
      userMenuActive: !prev.userMenuActive,
    }));
    console.log('User menu active:', this.drawerState().userMenuActive);
  }
}
