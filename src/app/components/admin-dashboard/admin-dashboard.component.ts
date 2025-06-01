import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ButtonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  // Define any properties or methods needed for the admin dashboard

  constructor(private notify: MessageService, private router: Router) {
    // Initialize any services or properties if needed
  }

  ngOnInit(): void {
    this.notify.add({
      severity: 'info',
      summary: 'Admin Dashboard',
      detail: 'Welcome to the Admin Dashboard!',
      life: 3000 // Duration in milliseconds
    });
  }

navigateTo(route: string): void {
    // Logic to navigate to the specified route
    // This could be implemented using Angular's Router service
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);


}
}
