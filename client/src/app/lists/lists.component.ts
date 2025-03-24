import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PageChangedEvent, PaginationModule} from 'ngx-bootstrap/pagination';
import {ButtonsModule} from 'ngx-bootstrap/buttons';

import {LikesService} from '../_services/likes.service';
import {MemberCardComponent} from "../members/member-card/member-card.component";

@Component({
  selector: 'app-lists',
  imports: [FormsModule, ButtonsModule, MemberCardComponent, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent {

  private readonly likesService = inject(LikesService)

  members = this.likesService.paginatedResponse
  predicate = 'predicate'
  pageNumber = 1
  pageSize = 5

  ngOnInit (): void {
    this.loadLikes()
  }

  getTitle () {
    switch (this.predicate)
    {
      case 'liked':
        return 'Liked Members'
      case 'likedBy':
        return 'Members who liked you'
      default:
        return 'Mutual'
    }

  }

  loadLikes () {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize)
  }

  pageChanged (event: PageChangedEvent) {
    if (this.pageNumber !== event.page)
    {
      this.pageNumber = event.page
      this.loadLikes()

    }
  }

  ngOnDestroy (): void {
    this.likesService.paginatedResponse.set(null)
  }
}
