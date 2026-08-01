import { Component, effect } from '@angular/core';
import { DrawerSignalService } from '@service/drawer-signal.service';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-save-group',
  imports: [DrawerModule],
  templateUrl: './save-group.component.html',
  styleUrl: './save-group.component.scss'
})
export class SaveGroupComponent {
  visible: boolean = false;

  constructor(private drawerSignal: DrawerSignalService) {
    // React to global "group" drawer signal
    effect(() => {
      this.visible = this.drawerSignal.drawers.group();
    });
  }

  onHide() {
    console.log('Drawer closed');
    this.drawerSignal.close('group');
  }
}
