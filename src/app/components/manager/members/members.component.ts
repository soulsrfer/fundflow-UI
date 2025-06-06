import { Component, OnInit } from '@angular/core';
import { Member } from '@interfaces/member.interface';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { UtilityService } from '@service/utility.service';
import { TextareaModule } from 'primeng/textarea';

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
  constructor(private utilityService: UtilityService) {
    this.initializeForm(null);
  }

  ngOnInit() {}

  initializeForm(member: Member | null) {
    this.memberForm = new FormGroup({
      id: new FormControl(member ? member.id : null),
      name: new FormControl(member ? member.name : '', [Validators.required]),
      phone: new FormControl(member ? member.phone : '', [Validators.required]),
      email: new FormControl(member ? member.email : '', [Validators.email,]),
      address: new FormControl(member ? member.address : null),
      joinedDate: new FormControl(member ? member.joinedDate : new Date(), [
        Validators.required,
      ]),
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
    this.isDrawerVisible = true;
  }
  editMember(member: Member) {}
  confirmDelete(member: Member) {}

  onHide() {
    this.isDrawerVisible = false;
  }

  onSubmit() {
    this.memberForm.markAllAsTouched();
    if (this.memberForm.valid) {
      this.selectedMember = this.memberForm.value as Member;
      if (this.selectedMember.id) {
        console.log('Updating member:', this.selectedMember);
      } else {
        console.log('Adding new member:', this.selectedMember);
      }
    } else {
      this.utilityService.markControlsAsDirtyAndTouched(this.memberForm);
      console.error('Form is invalid');
      return;
    }
  }
}
