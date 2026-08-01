import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerSignalService {
  drawers = {
    group: signal(false),
    loan: signal(false),
    member: signal(false),
  };

  // Open a specific drawer
  open(name: keyof typeof this.drawers) {
    console.log('Opening drawer:', name);
    this.drawers[name].set(true);
  }

  // Close a specific drawer
  close(name: keyof typeof this.drawers) {
    console.log('Closing drawer:', name);
    this.drawers[name].set(false);
  }

  // Toggle any drawer
  toggle(name: keyof typeof this.drawers) {
    this.drawers[name].update(v => !v);
  }

  // Close all drawers (optional)
  closeAll() {
    Object.values(this.drawers).forEach(drawer => drawer.set(false));
  }
}
