import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Contribution } from '@interfaces/contribution.interface';
import { Member } from '@interfaces/member.interface';
import { ContributionService } from '@service/contribution.service';
import { MemberService } from '@service/member.service';
import { UtilityService } from '@service/utility.service';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-contributions',
  imports: [
    TableModule,
    ButtonModule,
    ToggleSwitchModule,
    CommonModule,
    FormsModule,
    DrawerModule,
    ReactiveFormsModule,
    MessageModule,
    AutoCompleteModule,
    InputNumberModule,
    DatePickerModule,
    DialogModule,
  ],
  templateUrl: './contributions.component.html',
  styleUrl: './contributions.component.scss',
})
export class ContributionsComponent implements OnInit {
  contributions: Contribution[] = [];
  isDrawerVisible: boolean = false;
  contributionForm: FormGroup = new FormGroup({});
  memberSuggestions: Member[] = [];
  allMembers: Member[] = [];
  visibleDialog: boolean = false;
  selectedContribution: Contribution | null = null;

  first = 0;
  rowsPerPage = 50;
  totalRecords = 0;
  showLoader = false;
  defaultSortField: string = 'date';
  defaultSortOrder: number = -1;

  constructor(
    private memberService: MemberService,
    private utilityService: UtilityService,
    private contributionService: ContributionService
  ) {
    this.initializeContributionForm(null);
  }
  ngOnInit(): void {
    this.getMemberList();
  }
  get memberControl() {
    return this.contributionForm.get('memberId') as FormControl;
  }
  get amountControl() {
    return this.contributionForm.get('amount') as FormControl;
  }
  get dateControl() {
    return this.contributionForm.get('date') as FormControl;
  }

  initializeContributionForm(contribution: Contribution | null) {
    this.contributionForm = new FormGroup({
      id: new FormControl(contribution ? contribution.id : null),
      memberId: new FormControl(contribution ? contribution.memberId : null, [
        Validators.required,
      ]),
      amount: new FormControl(contribution ? contribution.amount : 0, [
        Validators.required,
      ]),
      date: new FormControl(
        contribution ? new Date(contribution.date) : new Date(),
        [Validators.required]
      ),
    });
  }

  addContribution() {
    this.selectedContribution = null;
    this.openContributionDrawer();
  }

  openContributionDrawer() {
    this.initializeContributionForm(this.selectedContribution);
    this.isDrawerVisible = true;
  }

  editContribution(contribution: Contribution) {
    this.selectedContribution = contribution;
    this.openContributionDrawer();
  }

  confirmDelete(contribution: Contribution) {
    this.selectedContribution = contribution;
    this.visibleDialog = true;
  }
  onSubmit() {
    this.contributionForm.markAllAsTouched();
    if (this.contributionForm.valid) {
      this.selectedContribution = this.contributionForm.value as Contribution;
      this.selectedContribution.date = this.utilityService.adjustDate(
        this.selectedContribution.date
      );
      this.selectedContribution.id
        ? this.updateContribution(this.selectedContribution.id)
        : this.createContribution();
    } else {
      this.utilityService.markControlsAsDirtyAndTouched(this.contributionForm);
      return;
    }
  }

  createContribution() {
    this.contributionService
      .createContribution(this.selectedContribution as Contribution)
      .subscribe({
        next: () => {
          const event = this.createLazyLoadEvent();
          this.loadContributions(event);
          this.onHide();
        },
        error: (error) => {
          console.log('error while creating contribution', error);
        },
      });
  }
  updateContribution(id: number) {
    this.contributionService
      .updateContribution(id, this.selectedContribution as Contribution)
      .subscribe({
        next: () => {
          const event = this.createLazyLoadEvent();
          this.loadContributions(event);
          this.onHide();
        },
        error: (error) => {
          console.log('error while updating contribution:', error);
        },
      });
  }

  onHide() {
    this.selectedContribution = null;
    this.isDrawerVisible = false;
  }
  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.memberSuggestions = this.allMembers.filter((member) =>
      member.name.toLowerCase().includes(query)
    );
  }

  getMemberList() {
    const params = this.utilityService.tableLazyLoadEventToHttpParams({
      first: 0,
      rows: 100,
    } as TableLazyLoadEvent);

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

  onHideDialog() {
    this.visibleDialog = false;
    this.selectedContribution = null;
  }

  deleteContribution(id: number) {
    this.contributionService.deleteContribution(id).subscribe({
      next: () => {
        const event = this.createLazyLoadEvent();
        this.loadContributions(event);
        this.onHideDialog();
      },
      error: (error) => {
        console.log('error while deleting contribution:', error);
      },
    });
  }

  loadContributions(event: TableLazyLoadEvent) {
    console.log('Lazy load event:', event);
    this.showLoader = true;
    this.first = event.first ?? 0;
    const params = this.utilityService.tableLazyLoadEventToHttpParams(event);
    this.contributionService.getAllContributions(params).subscribe({
      next: (response) => {
        this.contributions = response.data.rows;
        this.totalRecords = response.data.totalItems;
      },
      error: (error) => {
        console.error('error while fetching contributions:', error);
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
