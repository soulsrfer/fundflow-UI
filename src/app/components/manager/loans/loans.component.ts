import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Loan } from '@interfaces/loan.interface';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { Member } from '@interfaces/member.interface';
import { MemberService } from '@service/member.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
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
  statusOptions: any[] = [
        { label: 'Open', value: 'OPEN' },
        { label: 'Close', value: 'CLOSE' }
    ];

  constructor(private memberService: MemberService) {this.initializeForm(null);}

  ngOnInit(): void {
    this.getMemberList();
  }

  initializeForm(loan: Loan | null) {
    this.loanForm = new FormGroup({
      id: new FormControl(loan ? loan.id : null),
      member: new FormControl(loan ? loan.member.id : null, [Validators.required]),
      principalAmount: new FormControl(loan ? loan.principalAmount : 0, [Validators.required]),
      interestRate: new FormControl(loan ? loan.monthlyInterestAmt : 0, [Validators.required]),
      startDate: new FormControl(loan ? loan.issuedDate : null, [Validators.required]),
      endDate: new FormControl(loan ? loan.balanceRemaining : null, []),
      status: new FormControl(loan ? loan.status : 'OPEN', [Validators.required]),
    });

  }

  get memberControl() {
    return this.loanForm.get('member') as FormControl;
  }

  get amountControl() {
    return this.loanForm.get('principalAmount') as FormControl;
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
    this.memberService.getAllMembers().subscribe({
      next: (response) => {
        if (response.success) {
          this.allMembers = response.data;
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
    this.selectedLoan = null;
    this.openLoanDrawer();
  }

  openLoanDrawer() {
    this.initializeForm(this.selectedLoan);
    this.isDrawerVisible = true;
  }
  editLoan(loan: Loan) {}

  confirmDelete(loan: Loan) {}

  onHide() {
    this.isDrawerVisible = false;
  }

  onSubmit() {
    console.log('Form Submitted:', this.loanForm.value);
  }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    let _members = [...Array(10).keys()];

    this.memberSuggestions = this.allMembers.filter((member) =>
      member.name.toLowerCase().includes(query)
    );
  }
}
