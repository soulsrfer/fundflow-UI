import { Component, OnInit } from '@angular/core';
import { Member } from '@interfaces/member.interface';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import {
  Form,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { UtilityService } from '@service/utility.service';
import { TextareaModule } from 'primeng/textarea';
import { MemberService } from '@service/member.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-members',
  imports: [
    TableModule,
    ButtonModule,
    DrawerModule,
    MessageModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    DatePickerModule,
    ToggleSwitchModule,
    TextareaModule,
    InputNumberModule,
    FormsModule,
    DialogModule,
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent implements OnInit {
  members: Member[] = [];
  selectedMember: Member | null = null;
  isDrawerVisible: boolean = false;
  memberForm: FormGroup = new FormGroup({});
  submissionError: string | null = null;
  visibleDialog: boolean = false;
  first = 0;
  rowsPerPage = 50;
  totalRecords = 0;
  showLoader = false;
  defaultSortField: string = 'joinedDate';
  defaultSortOrder: number = -1;

  constructor(
    private utilityService: UtilityService,
    private memberService: MemberService
  ) {
    this.initializeForm(null);
  }

  ngOnInit() {
  }

  initializeForm(member: Member | null) {
    console.log('selected memeber:', member);
    this.memberForm = new FormGroup({
      id: new FormControl(member ? member.id : null),
      name: new FormControl(member ? member.name : '', [Validators.required]),
      phone: new FormControl(member ? member.phone : '', [Validators.required]),
      email: new FormControl(member ? member.email : '', [Validators.email]),
      address: new FormControl(member ? member.address : null),
      joinedDate: new FormControl(
        member ? new Date(member.joinedDate) : new Date(),
        [Validators.required]
      ),
      active: new FormControl(member ? member.active : true, [
        Validators.required,
      ]),
    });
  }

  get nameControl() {
    return this.memberForm.get('name') as FormControl;
  }

  get phoneControl() {
    return this.memberForm.get('phone') as FormControl;
  }
  get emailControl() {
    return this.memberForm.get('email') as FormControl;
  }
  get joinedDateControl() {
    return this.memberForm.get('joinedDate') as FormControl;
  }

  addMember() {
    this.selectedMember = null;
    this.openMemberDrawer();
  }

  editMember(member: Member) {
    this.selectedMember = member;
    this.openMemberDrawer();
  }

  openMemberDrawer() {
    this.initializeForm(this.selectedMember);
    this.isDrawerVisible = true;
  }

  confirmDelete(member: Member) {
    this.selectedMember = member;
    this.visibleDialog = true;
  }

  onHide() {
    this.isDrawerVisible = false;
  }

  onSubmit() {
    this.memberForm.markAllAsTouched();
    if (this.memberForm.valid) {
      this.selectedMember = this.memberForm.value as Member;
      const rawValue = this.memberForm.get('joinedDate')?.value;
      const date = new Date(rawValue);
      const adjustedDate = new Date(
        date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
      );
      this.selectedMember.joinedDate = adjustedDate;
      if (this.selectedMember.id) {
        this.updateMember(this.selectedMember.id);
      } else {
        console.log('Adding new member:', this.selectedMember);
        this.creatMember();
      }
    } else {
      this.utilityService.markControlsAsDirtyAndTouched(this.memberForm);
      console.error('Form is invalid');
      return;
    }
  }

  creatMember() {
    this.memberService.createMember(this.selectedMember as Member).subscribe({
      next: (response) => {
        console.log('Member added successfully:', response);
        const event = this.utilityService.createLazyLoadEvent(this.first, this.rowsPerPage, this.defaultSortField, this.defaultSortOrder);
        this.loadMembers(event);
        this.selectedMember = null;
        this.isDrawerVisible = false;
      },
      error: (error) => {
        console.error('Error adding member:', error);
      },
    });
  }

  updateMember(id: number) {
    this.memberService
      .updateMember(id, this.selectedMember as Member)
      .subscribe({
        next: (response) => {
          console.log('Member updated successfully', response);
          const event = this.utilityService.createLazyLoadEvent(
            this.first,
            this.rowsPerPage,
            this.defaultSortField,
            this.defaultSortOrder
          );
          this.loadMembers(event);
          this.isDrawerVisible = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteMember(id?: number) {
    if (!id) return;
    this.memberService.deleteMember(id).subscribe({
      next: (response) => {
        const event = this.utilityService.createLazyLoadEvent(
          this.first,
          this.rowsPerPage,
          this.defaultSortField,
          this.defaultSortOrder
        );
        this.loadMembers(event);
        this.onHideDialog();
      },
      error: (error) => {
        console.error('Error deleting member:', error);
      },
    });
  }

  onHideDialog() {
    this.visibleDialog = false;
    this.selectedMember = null;
  }

  loadMembers(event: TableLazyLoadEvent) {
    this.showLoader = true;
    this.first = event.first ?? 0;
    const params = this.utilityService.tableLazyLoadEventToHttpParams(event);

    this.memberService.getAllMembers(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.members = response.data.rows;
          this.totalRecords = response.data.totalItems;
          console.log('Members fetched successfully:');
        } else {
          console.error('Failed to fetch members:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching members:', error);
      },
      complete: () => {
        this.showLoader = false;
      },
    });
  }

  onChangeActive(event: ToggleSwitchChangeEvent, memberId: number) {
    this.memberService.patchActive(memberId, event.checked as boolean).subscribe({
      next: (response) => {
        
      },
      error: (error) => {
        console.error('Error updating member active status:', error);
      }
    });
  }
}
