import {Component, HostListener, inject, viewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';

import {GalleryItem} from 'ng-gallery';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';
import {TimeagoModule} from 'ngx-timeago';
import {TabsModule} from 'ngx-bootstrap/tabs';

import {AccountService} from './../../_services/account.service';
import {Member} from '../../_models/member';
import {MembersService} from '../../_services/members.service';
import {PhotoEditorComponent} from "../photo-editor/photo-editor.component";

@Component({
  selector: 'app-member-edit',
  imports: [TabsModule, FormsModule, PhotoEditorComponent, DatePipe, TimeagoModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent {

  editForm = viewChild<NgForm>('editForm')
  @HostListener('window:beforeunload', ['$event']) notify ($event: any) {
    if (this.editForm()?.dirty) $event.returnValue = true
  }

  member?: Member
  images: GalleryItem[] = []

  private readonly accountService = inject(AccountService)
  private readonly memberService = inject(MembersService)
  private readonly toaster = inject(ToastrService)

  ngOnInit (): void {
    this.loadMember()
  }

  loadMember () {
    const username = this.accountService.currentUser()
    if (!username) return
    this.memberService.getMember(username.username).subscribe({
      next: member => this.member = member
    })
  }

  updateMember () {

    if (!this.member) return
    this.memberService.updateMember(this.editForm()?.value).subscribe({
      next: _ => {
        this.toaster.success('Profile updated successfully')
        this.editForm()?.reset(this.member)
      }
    })
  }

  onMemberChange (event: Member) {
    this.member = event
    this.loadMember()
  }
}
