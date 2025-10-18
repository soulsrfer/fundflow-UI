import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { LabelValue } from '@interfaces/label-value.interface';
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
    SelectModule,
  ],
  templateUrl: './schedule-entries.component.html',
  styleUrl: './schedule-entries.component.scss',
})
export class ScheduleEntriesComponent implements OnInit {
  @ViewChild('entryTable') entryTable: Table | undefined; 
  @ViewChild('filter') filter!: ElementRef;
  entries: ScheduleEntry[] = [];
  selectedEntry: ScheduleEntry | null = null;
  isDrawerVisible: boolean = false;
  entryForm: FormGroup = new FormGroup({});
  entryStatusOptions: any[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
  ];

  first = 0;
  rowsPerPage = 50;
  totalRecords = 0;
  showLoader = false;
  defaultSortField: string = 'dueDate';
  defaultSortOrder: number = 1;

  defaultStatus: string = 'PENDING';
  statusOptions: LabelValue[] = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
  ];

  constructor(
    private entryService: ScheduleEntryService,
    private utilityService: UtilityService
  ) {
    this.initializeEntryForm(null);
  }

  ngOnInit(): void {}

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
      this.updateEntry(this.selectedEntry.id);
    } else {
      this.utilityService.markControlsAsDirtyAndTouched(this.entryForm);
      return;
    }
  }

  updateEntry(id: number) {
    this.entryService
      .updateEntry(id, this.selectedEntry as ScheduleEntry)
      .subscribe({
        next: (response) => {
          const event = this.createLazyLoadEvent();
          this.loadScheduleEntries(event);
          this.onHide();
        },
        error: (error) => {
          console.error('error updating entry:', error);
        },
      });
  }

  loadScheduleEntries(event: TableLazyLoadEvent) {
    this.showLoader = true;
    this.first = event.first ?? 0;
    
    const params = this.utilityService.tableLazyLoadEventToHttpParams(event);

    this.entryService.getAllScheduleEntries(params).subscribe({
      next: (response) => {
        this.entries = response.data.rows;
        this.totalRecords = response.data.totalItems;
        this.onHide();
      },
      error: (error) => {
        console.log('error while fetching ScheduleEntries: ', error);
      },
      complete: () => {
        this.showLoader = false;
      },
    });
  }

  createLazyLoadEvent() {
    return {
      first: this.first,
      rows: this.rowsPerPage,
      sortField: this.defaultSortField,
      sortOrder: this.defaultSortOrder,
      filters: {},
    } as TableLazyLoadEvent;
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
}
