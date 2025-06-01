import { Component, OnInit } from '@angular/core';
import { UserMenu } from '@interfaces/user-menu.interface';
import { MenuService } from '@service/menu.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DrawerModule } from 'primeng/drawer';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { RippleModule } from 'primeng/ripple';
import { UtilityService } from '@service/utility.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-menu-permission',
  imports: [
    TableModule,
    ButtonModule,
    DrawerModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    AutoCompleteModule,
    SelectModule,
    RippleModule,
    FormsModule,
    DialogModule,
  ],
  templateUrl: './menu-permission.component.html',
  styleUrl: './menu-permission.component.scss',
})
export class MenuPermissionComponent implements OnInit {
  menuItems!: UserMenu[];
  selectedItem!: UserMenu;
  isVisible: boolean = false;
  visibleDialog: boolean = false;

  menuForm!: FormGroup;
  parentSuggestions: UserMenu[] = [];
  roleOptions: string[] = ['ADMIN', 'USER', 'GUEST']; // Example roles, replace with actual roles as needed

  constructor(
    private menuService: MenuService,
    private fb: FormBuilder,
    private utilityService: UtilityService
  ) {
    this.initializeForm(this.selectedItem);
  }
  ngOnInit(): void {
    this.menuService.getAllMenuItems().subscribe({
      next: (response) => {
        this.menuItems = response.data;
      },
      error: (error) => {
        console.error('Error fetching menu items:', error);
      },
    });
  }

  openMenuItem() {
    this.initializeForm(this.selectedItem);
    this.isVisible = true;
  }

  editMenuItem(item: UserMenu) {
    this.selectedItem = item;
        this.openMenuItem();
  }
  confirmDelete(item: UserMenu) {
    this.selectedItem = item;
    this.visibleDialog = true;
  }
  deleteMenuItem(id: string) {
    console.log('Deleting menu item with id:', id);
    this.menuService.deleteMenuItem(id).subscribe({
      next: (response) => {
        console.log('Menu item deleted:', response);
        this.menuItems = this.menuItems.filter((item) => item.id !== response.data.id);
        this.onHideDialog() 
      },
      error: (error) => {
        console.error('Error deleting menu item:', error);
      },
    });

  }

  initializeForm(item?: UserMenu) {
    console.log('Initializing form with item:', item);
    this.menuForm = this.fb.group({
      id: new FormControl(item?.id ?? null),
      label: new FormControl(item?.label ?? '', [Validators.required]),
      routerLink: new FormControl(item?.routerLink ?? ''),
      icon: new FormControl(item?.icon ?? ''),
      parentId: new FormControl(item?.parentId ?? null),
      role: new FormControl(item?.role ?? '', [Validators.required]),
    });
  }

  get roleControl() {
    return this.menuForm.get('role');
  }

  get labelControl() {
    return this.menuForm.get('label');
  }

  onSubmit() {
    console.log('Submitting form...');
    this.menuForm.markAllAsTouched();
    if (this.menuForm.invalid) {
      this.utilityService.markControlsAsDirtyAndTouched(this.menuForm);
      console.error('Form is invalid');
      return;
    }
    console.log('Form submitted:', this.menuForm.value);
    this.selectedItem = this.menuForm.value as UserMenu;
    const itemId = this.menuForm.value.id;
    console.log('Selected item for submission:', this.selectedItem);
    itemId == null ? this.createMenuItem() : this.updateMenuItem(itemId);
  }

  createMenuItem() {
    this.menuService.createMenuItem(this.selectedItem).subscribe({
      next: (response) => {
        console.log('Menu item created:', response.data);
        this.menuItems.push( response.data);
        this.onHide(); 
      },
      error: (error) => {
        console.error('Error creating menu item:', error);
      },  
    });
  }

  updateMenuItem(itemId: string) {
    this.menuService.updateMenuItem(itemId, this.selectedItem).subscribe({
      next: (response) => {
        console.log('Menu item updated:', response.data);
        const index = this.menuItems.findIndex((item) => item.id === itemId);
        if (index !== -1) {
          this.menuItems[index] = response.data; // Update the existing item
        }
        this.onHide(); // Close the drawer after update
      },
      error: (error) => {
        console.error('Error updating menu item:', error);
      },
    });
  }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const selectedId = this.selectedItem?.id;

    this.parentSuggestions = this.menuItems
      .filter((item) => item.id != null && item.label != null) // ensure both id and label exist
      .filter((item) => item.id !== selectedId) // exclude selected item by id
      .filter((item) => item.label!.toLowerCase().includes(query)); // filter by label
  }

  onHide() {
    this.isVisible = false;
    this.menuForm.reset();
    this.selectedItem = {} as UserMenu; // Reset selected item
  }

  onHideDialog() {
    this.visibleDialog = false;
    this.selectedItem = {} as UserMenu;
  }
}
