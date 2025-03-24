import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {PageChangedEvent, PaginationModule} from 'ngx-bootstrap/pagination';

import {MemberCardComponent} from "../member-card/member-card.component";
import {MembersService} from './../../_services/members.service';

@Component({
  selector: 'app-member-list',
  imports: [MemberCardComponent, ButtonsModule, PaginationModule, FormsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent {

  private readonly memberService = inject(MembersService)

  member = this.memberService
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  ngOnInit (): void {
    if (!this.memberService.paginatedResponse())
      this.loadMembers()
  }

  loadMembers () {
    this.memberService.getMembers()
  }

  resetFilters () {
    this.memberService.resetUserParams()
    this.loadMembers()
  }

  pageChanged (event: PageChangedEvent) {
    if (this.memberService.userParams().pageNumber !== event.page)
    {
      this.memberService.userParams().pageNumber = event.page
      this.loadMembers()
      window.scrollTo(0, 0)
    }
  }
}
