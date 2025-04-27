import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../layout.service';
import { DrawerService } from '../../drawer/drawer.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterModule, CommonModule, StyleClassModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  items!: MenuItem[];
  isVisible: boolean = false;

  constructor(public layoutService: LayoutService,
    public drawerService: DrawerService
  ) {}

  toggleDarkMode() {
      this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
