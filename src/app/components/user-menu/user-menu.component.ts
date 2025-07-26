import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth.service';
import { DrawerModule } from 'primeng/drawer';
import { LayoutService } from 'src/app/layout/layout.service';
@Component({
  selector: 'app-user-menu',
  imports: [MenuModule, BadgeModule, AvatarModule, CommonModule, DrawerModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  items: MenuItem[] | undefined;
  constructor(private auth: AuthService,
    public layoutService: LayoutService ) {

  }
  ngOnInit() {
    this.items = [
        // {
        //     separator: true
        // },
       
        {
            label: 'Profile',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-cog',
                    shortcut: '⌘+O'
                },
                {
                    label: 'Messages',
                    icon: 'pi pi-inbox',
                    badge: '2'
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    shortcut: '⌘+Q',
                    command: () => {this.onLogout();}
                }
            ]
        },
        {
            separator: true
        }
    ];
}

onLogout() {
    console.log('User logged out');
    this.auth.logout();
}
}
