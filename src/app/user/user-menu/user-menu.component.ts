import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-menu',
  imports: [MenuModule, BadgeModule, AvatarModule, CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  items: MenuItem[] | undefined;
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
                    shortcut: '⌘+Q'
                }
            ]
        },
        {
            separator: true
        }
    ];
}
}
