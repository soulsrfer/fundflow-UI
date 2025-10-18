import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '@interfaces/user.interface';
import { UserService } from '@service/user.service';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-user-add-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    PasswordModule,
  ],
  templateUrl: './user-add-edit.component.html',
  styleUrl: './user-add-edit.component.scss',
})
export class UserAddEditComponent implements OnInit {
  userForm!: FormGroup;
  mode: 'add' | 'edit' = 'add';
  userId?: number;
  user?: User;

  roles = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Manager', value: 'MANAGER' },
    { label: 'Member', value: 'MEMBER' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId =
      Number(this.route.snapshot.paramMap.get('id') ?? undefined) || undefined;
    if (this.userId) {
      this.mode = 'edit';
      this.loadUser(this.userId);
    }
    this.initializeUserForm();
  }

  initializeUserForm() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: [
        '',
        this.userId ? [] : [Validators.required, Validators.minLength(6)],
      ],
      confirmPassword: [
        '',
        this.userId ? [] : [Validators.required, Validators.minLength(6)],
      ],
      role: ['', Validators.required],
    });
  }

  loadUser(id: number) {
    this.userService.loadUser(id).subscribe({
      next: (response) => {
        this.userForm.patchValue(response.data);
      },
      error: (error) => {
        console.error('error while loading user:', error);
      },
    });
  }

  onSubmit() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      this.user = this.userForm.value as User;
      this.userId ? this.updateUser(this.userId) : this.createUser();
    }

    if (this.userForm.invalid) return;
  }

  createUser() {
    this.userService.createUser(this.user as User).subscribe({
      next: (response) => {
        console.log('user created: ', response.data);
      },
      error: (error) => {
        console.log('error while creating user: ', error);
      },
    });
  }

  updateUser(id: number) {
    this.userService.updateUser(id, this.user as User).subscribe({
      next: (response) => {
        console.log('user updated: ', response.data);
      },
      error: (error) => {
        console.error('error while updating user: ', error);
      },
    });
  }
}
