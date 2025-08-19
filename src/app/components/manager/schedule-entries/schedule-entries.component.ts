import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScheduleEntry } from '@interfaces/schedule-entry.interface';
import { ScheduleEntryService } from '@service/schedule-entry.service';
import { UtilityService } from '@service/utility.service';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-schedule-entries',
  imports: [
    TableModule,
    CommonModule,
    TagModule,
    ButtonModule,
    DrawerModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    MessageModule,
    InputNumberModule,
    SelectButtonModule,
  ],
  templateUrl: './schedule-entries.component.html',
  styleUrl: './schedule-entries.component.scss',
})
export class ScheduleEntriesComponent implements OnInit {
  entries: ScheduleEntry[] = [];
  selectedEntry: ScheduleEntry | null = null;
  isDrawerVisible: boolean = false;
  entryForm: FormGroup = new FormGroup({});
  entryStatusOptions: any[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
  ];

  constructor(
    private entryService: ScheduleEntryService,
    private utilityService: UtilityService
  ) {
    this.initializeEntryForm(null);
  }

  ngOnInit(): void {
    this.getSheduleEntries();
  }

  get dueDateControl() {
    return this.entryForm.get('dueDate') as FormControl;
  }

  get dueAmountControl() {
    return this.entryForm.get('dueAmount') as FormControl;
  }

  get amountPaidControl() {
    return this.entryForm.get('amountPaid') as FormControl;
  }
  get statusControl() {
    return this.entryForm.get('amountPaid') as FormControl;
  }

  editEntry(entry: ScheduleEntry) {
    this.selectedEntry = entry;
    this.openEntryDrawer();
  }

  openEntryDrawer() {
    this.initializeEntryForm(this.selectedEntry);
    this.isDrawerVisible = true;
  }

  initializeEntryForm(entry: ScheduleEntry | null) {
    console.log('selected Entry:', entry);
    this.entryForm = new FormGroup({
      id: new FormControl(entry ? entry.id : 0, [Validators.required]),
      loanId: new FormControl(entry ? entry.loanId : 0, [Validators.required]),
      periodNumber: new FormControl(entry ? entry.periodNumber : 0, [
        Validators.required,
      ]),
      dueDate: new FormControl(entry ? new Date(entry.dueDate) : new Date(), [
        Validators.required,
      ]),
      dueAmount: new FormControl(entry ? entry.dueAmount : 0, [
        Validators.required,
      ]),
      amountPaid: new FormControl(entry ? entry.amountPaid : 0, [
        Validators.required,
      ]),
      status: new FormControl(entry ? entry.status : '', [Validators.required]),
      penalty: new FormControl(entry ? entry.penalty : 0),
    });
  }

  getSheduleEntries() {
    this.entryService.getAllScheduleEntries().subscribe({
      next: (response) => {
        this.entries = response.data;
        this.onHide();
      },
      error: (error) => {
        console.log('error while fetching ScheduleEntries: ', error);
      },
    });
  }

  onHide() {
    this.isDrawerVisible = false;
    this.entryForm.reset();
    this.selectedEntry = null;
  }

  onSubmit() {
    this.entryForm.markAllAsTouched();
    if (this.entryForm.valid) {
      this.selectedEntry = this.entryForm.value as ScheduleEntry;
      this.selectedEntry.dueDate = this.utilityService.adjustDate(
        this.selectedEntry.dueDate
      );
      console.log('updated Entry:', this.selectedEntry);
      this.updateEntry(this.selectedEntry.id);
    } else {
      this.utilityService.markControlsAsDirtyAndTouched(this.entryForm);
      console.error('Form is invalid');
      return;
    }
  }

  updateEntry(id: number) {
    this.entryService.updateEntry(id, this.selectedEntry as ScheduleEntry).subscribe({
      next:(response) => {
        console.log('Entry updated: ', response);
        this.getSheduleEntries();
        this.onHide();
      },
      error:(error) => {
        console.error("error updating entry:",error)
      }
    });
  }
}
