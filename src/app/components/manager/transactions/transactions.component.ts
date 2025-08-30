import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Transaction } from '@interfaces/transaction.interface';
import { TransactionService } from '@service/transaction.service';
import { UtilityService } from '@service/utility.service';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-transactions',
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
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  isDrawerVisible: boolean = false;
  transactionForm: FormGroup = new FormGroup({});
  transactionStatusOptions: any[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
  ];
  first = 0;
  rowsPerPage = 50;
  totalRecords = 0;
  showLoader = false;
  defaultSortField: string = 'date';
  defaultSortOrder: number = -1;

  get dateControl() {
    return this.transactionForm.get('date') as FormControl;
  }

  get amountControl() {
    return this.transactionForm.get('amount') as FormControl;
  }

  constructor(private transactionService: TransactionService,
    private utilityService: UtilityService
  ) {
    this.initializeTransactionForm(null);
  }
  ngOnInit(): void {
  }

  initializeTransactionForm(transaction: Transaction | null) {
    this.transactionForm = new FormGroup({
      date: new FormControl(
        transaction ? new Date(transaction.date) : new Date(),
        {
          nonNullable: true,
        }
      ),
      amount: new FormControl(transaction ? transaction.amount : null, {
        nonNullable: true,
      }),
      status: new FormControl(transaction ? transaction.status : 'PENDING', {
        nonNullable: true,
      }),
    });
  }
  editTransaction(transaction: Transaction) {}
  onHide() {}
  onSubmit() {}

  loadTransactions(event: TableLazyLoadEvent) {
    this.showLoader = true;
    this.first = event.first ?? 0;
    const params = this.utilityService.tableLazyLoadEventToHttpParams(event);

    this.transactionService.fetchAllTransactions(params).subscribe({
      next: (response) => {
        this.transactions = response.data.rows;
        this.totalRecords = response.data.totalItems;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },
      complete: () => {
        this.showLoader = false;
      },
    });

  }
}
