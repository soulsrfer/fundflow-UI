import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Loan } from '@interfaces/loan.interface';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { Member } from '@interfaces/member.interface';
import { MemberService } from '@service/member.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UtilityService } from '@service/utility.service';
import { LoanService } from '@service/loan.service';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
@Component({
  selector: 'app-loans',
  imports: [
    TableModule,
    ButtonModule,
    DrawerModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    DatePickerModule,
    ToggleSwitchModule,
    MessageModule,
    AutoCompleteModule,
    InputNumberModule,
    SelectButtonModule,
    DialogModule,
    FormsModule,
    TagModule
  ],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.scss',
})
export class LoansComponent implements OnInit {
  loans: Loan[] = [];
  selectedLoan: Loan | null = null;
  isDrawerVisible: boolean = false;
  loanForm: FormGroup = new FormGroup({});
  memberSuggestions: Member[] = [];
  allMembers: Member[] = [];
  visibleDialog: boolean = false;

  statusOptions: any[] = [
    { label: 'Open', value: 'OPEN' },
    { label: 'Close', value: 'CLOSED' },
  ];

  first = 0;
  rowsPerPage = 50;
  totalRecords = 0;
  showLoader = false;
  defaultSortField: string = 'issuedDate';
  defaultSortOrder: number = -1;

  constructor(
    private memberService: MemberService,
    private utilityService: UtilityService,
    private loanService: LoanService,
    private router: Router
  ) {
    this.initializeForm(null);
  }

  ngOnInit(): void {
    this.getMemberList();
  }

  initializeForm(loan: Loan | null) {
    this.loanForm = new FormGroup({
      id: new FormControl(loan ? loan.id : null),
      memberId: new FormControl(loan ? loan.memberId : null, [
        Validators.required,
      ]),
      principalAmount: new FormControl(loan ? loan.principalAmount : 0, [
        Validators.required,
      ]),
      flatInterestRate: new FormControl(loan ? loan.flatInterestRate : 0, [
        Validators.required,
      ]),
      issuedDate: new FormControl(
        loan ? new Date(loan.issuedDate) : new Date(),
        [Validators.required]
      ),
      endDate: new FormControl(loan ? loan.balanceRemaining : null, []),
      status: new FormControl(loan ? loan.status : 'OPEN', [
        Validators.required,
      ]),
      numberOfInstallments: new FormControl(loan ? loan.numberOfInstallments : 1, [
        Validators.required,
      ]),
    });
  }

  get memberControl() {
    return this.loanForm.get('memberId') as FormControl;
  }

  get amountControl() {
    return this.loanForm.get('principalAmount') as FormControl;
  }

  get installmentControl() {
    return this.loanForm.get('numberOfInstallments') as FormControl;
  }

  get rateControl() {
    return this.loanForm.get('interestRate') as FormControl;
  }

  get startDateControl() {
    return this.loanForm.get('startDate') as FormControl;
  }

  get statusControl() {
    return this.loanForm.get('status') as FormControl;
  }

  getMemberList() {
    const params = this.utilityService.tableLazyLoadEventToHttpParams({first:0,rows:100} as TableLazyLoadEvent);
    this.memberService.getAllMembers(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.allMembers = response.data.rows;
        } else {
          console.error('Failed to fetch members:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching members:', error);
      },
    });
  }

  addLoan() {
    this.initializeForm(null);
    this.isDrawerVisible = true;
  }

  editLoan(loan: Loan) {
    this.router.navigate(['dashboard/manager/loans', loan.id]);
  }

  confirmDelete(loan: Loan) {
    this.selectedLoan = loan;
    this.visibleDialog = true;
  }

  onHide() {
    this.isDrawerVisible = false;
  }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    let _members = [...Array(10).keys()];

    this.memberSuggestions = this.allMembers.filter((member) =>
      member.name.toLowerCase().includes(query)
    );
  }

  onSubmit() {
    this.loanForm.markAllAsTouched();
    if (this.loanForm.valid) {
      this.selectedLoan = this.loanForm.value as Loan;
      const rawValue = this.loanForm.get('issuedDate')?.value;
      const date = new Date(rawValue);
      const adjustedDate =this.utilityService.adjustDate(date);
      this.selectedLoan.issuedDate = adjustedDate;
      if (this.selectedLoan.id) {
        this.updateLoan(this.selectedLoan.id);
      } else {
        this.createLoan();
      }
    } else {
      this.utilityService.markControlsAsDirtyAndTouched(this.loanForm);
      console.error('Form is invalid');
      return;
    }
  }

  createLoan() {
    this.loanService.createLoan(this.selectedLoan as Loan).subscribe({
      next: (response) => {
        const event = this.createLazyLoadEvent();
        this.loadLoans(event);
        this.selectedLoan = null;
        this.isDrawerVisible = false;
      },
      error: (error) => {
        console.error('Error adding loan:', error);
      },
    });
  }

  updateLoan(id: number) {
    this.loanService.updateLoan(id, this.selectedLoan as Loan).subscribe({
      next: (response) => {
        this.isDrawerVisible = false;
        const event = this.createLazyLoadEvent();
        this.loadLoans(event);
      },
      error: (error) => {
        console.error('Error updating loan:', error);
      },
    });
  }

  deleteLoan(id?: number) {
    if (!id)return;
    this.loanService.deleteLoan(id).subscribe({
      next: (response) => {
        const event = this.createLazyLoadEvent();
        this.loadLoans(event);
        this.selectedLoan = null;
        this.visibleDialog = false;
      },
      error: (error) => {
        console.error('Error deleting loan:', error);
      },
    });
  }

  onHideDialog() {
    this.visibleDialog = false;
    this.selectedLoan = null;
  }

  loadLoans(event: TableLazyLoadEvent) {
    this.showLoader = true;
    this.first = event.first ?? 0;
    const params = this.utilityService.tableLazyLoadEventToHttpParams(event);
    this.loanService.getAllLoans(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.loans = response.data.rows;
          this.totalRecords = response.data.totalItems;
        } else {
          console.error('Failed to fetch loans:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching loans:', error);
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
}
