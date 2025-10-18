import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LabelValue } from '@interfaces/label-value.interface';
import { User } from '@interfaces/user.interface';
import { UserService } from '@service/user.service';
import { UtilityService } from '@service/utility.service';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    TableModule,
    SelectModule,
    TagModule,
    ButtonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  users: User[] = [];
  selectedUser: User | null = null;
  first = 0;
  rowsPerPage = 50;
  totalRecords = 0;
  showLoader = false;
  defaultSortField: string = 'role';
  defaultSortOrder: number = 1;

  defaultRole: string = 'MANAGER';
  statusOptions: LabelValue[] = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Manager', value: 'MANAGER' },
    { label: 'Member', value: 'MEMBER' },
  ];

  constructor(
    private utility: UtilityService,
    private userService: UserService
  ) {}

  loadUser(event: TableLazyLoadEvent) {
    setTimeout(() => {
      this.showLoader = true;
    });
    this.first = event.first ?? 0;
    const params = this.utility.tableLazyLoadEventToHttpParams(event);

    this.userService.getAllUsers(params).subscribe({
      next: (response) => {
        this.users = response.data.rows;
        console.log(this.users);
        this.totalRecords = response.data.totalItems;
      },
      error: (error) => {
        console.error('Error while fetching users', error);
      },
      complete: () => {
        this.showLoader = false;
      },
    });
  }

  getSeverity(status: string) {
    switch (status.toLowerCase()) {
      case 'cancelled':
        return 'danger';

      case 'paid':
        return 'success';

      case 'pending':
        return 'warn';

      default:
        return 'secondary';
    }
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
  }

  addUser() {}
}
