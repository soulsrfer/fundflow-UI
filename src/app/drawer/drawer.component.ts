import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { DrawerService } from './drawer.service';
import { UserMenuComponent } from "@components/user-menu/user-menu.component";

@Component({
  selector: 'app-drawer',
  imports: [DrawerModule, UserMenuComponent, UserMenuComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent {
  constructor(public drowerService: DrawerService) {

  }
}
