import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule, ButtonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {
  attemptedUrl: string = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.attemptedUrl = this.router.url;
    console.error(`Route not found: ${this.attemptedUrl}`);
    if (this.attemptedUrl.startsWith('/.well-known')) {
    // Don't log this noise
    return;
  }
  }
}
