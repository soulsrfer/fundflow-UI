import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ButtonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  // Define any properties or methods needed for the admin dashboard

  constructor(private notify: MessageService, private router: Router) {
    // Initialize any services or properties if needed
  }

  ngOnInit(): void {
  }

navigateTo(route: string): void {
    // Logic to navigate to the specified route
    // This could be implemented using Angular's Router service
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);


}
}
