import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SaveGroupComponent } from '../groups/save-group/save-group.component';
import { DrawerSignalService } from '@service/drawer-signal.service';

@Component({
  selector: 'app-manager-dashboard',
  imports: [RouterModule, SaveGroupComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss',
})
export class ManagerDashboardComponent {
  constructor(private drawerSignal: DrawerSignalService) {}

  openGroupDrawer() {
    this.drawerSignal.open('group');
  }
}
