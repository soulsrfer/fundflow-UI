import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Loan } from '@interfaces/loan.interface';
import { LoanService } from '@service/loan.service';
import { ROUTES } from '@utils/app.constants';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ScheduleEntry } from '@interfaces/schedule-entry.interface';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DrawerModule } from 'primeng/drawer';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UtilityService } from '@service/utility.service';
import { ScheduleEntryService } from '@service/schedule-entry.service';
import { response } from 'express';

@Component({
  selector: 'app-edit-loan',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    MessageModule,
    DividerModule,
    TableModule,
    ButtonModule,
    TagModule,
    DrawerModule,
    DatePickerModule,
    MessageModule,
    InputNumberModule,
    SelectModule,
    SelectButtonModule,
  ],
  templateUrl: './edit-loan.component.html',
  styleUrl: './edit-loan.component.scss',
})
export class EditLoanComponent implements OnInit {
  loanId!: number;
  loan!: Loan;
  entries: ScheduleEntry[] = [];
  selectedEntry: ScheduleEntry | null = null;
  isEntryDrawerVisible: boolean = false;
  entryForm: FormGroup = new FormGroup({});
  entryStatusOptions: any[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
  ];
  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService,
    private utilityService: UtilityService,
    private entryService: ScheduleEntryService,
    private router: Router
  ) {
    this.initializeEntryForm(null);
  }

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.loanId) {
      console.error('No loan id in URL');
      this.router.navigate([ROUTES.LOANS]);
      return;
    }
    this.getLoanDetails();
  }

  getLoanDetails() {
    this.loanService.getLoanById(this.loanId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loan = response.data;
          this.entries = this.loan.scheduleEntries;
        } else {
          console.error('Failed to fetch loan data:', response.message);
          this.router.navigate(['ROUTES.LOANS']);
        }
      },
      error: (error) => {
        console.error('Error fetching loan data:', error);
        this.router.navigate(['ROUTES.LOANS']);
      },
    });
  }

  editEntry(entry: ScheduleEntry) {
    this.selectedEntry = entry;
    this.openEntryDrawer();
  }
  openEntryDrawer() {
    this.initializeEntryForm(this.selectedEntry);
    this.isEntryDrawerVisible = true;
  }

  onHide() {
    this.isEntryDrawerVisible = false;
    this.entryForm.reset();
    this.selectedEntry = null;
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

  // get loanControl() {
  //   return this.entryForm.get('loanId') as FormControl;
  // }

  // get periodNumberControl() {
  //   return this.entryForm.get('periodNumber') as FormControl;
  // }

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

  onSubmit() {
    this.entryForm.markAllAsTouched();
    if (this.entryForm.valid) {
      this.selectedEntry = this.entryForm.value as ScheduleEntry;
      this.utilityService.adjustDate(new Date(this.entryForm.get('dueDate')?.value));
      const date = new Date(this.entryForm.get('dueDate')?.value);
      const adjustedDate = this.utilityService.adjustDate(date);
      this.selectedEntry.dueDate = adjustedDate;
      console.log("updated Entry:",this.selectedEntry)
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
        console.log('Entry updated successfully:', response);
        this.getLoanDetails();
        this.onHide();
      },
      error:(error) => {
        console.error("error updating entry:",error)
      }
    });
  }

  confirmDelete(entry: ScheduleEntry) {}
}
