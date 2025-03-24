import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {Component, inject} from '@angular/core';

import {User} from '../../_models/user';
import {AdminService} from './../../_services/admin.service';
import {RolesModalComponent} from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

  private readonly adminService = inject(AdminService)
  private readonly modalService = inject(BsModalService)

  users: User[] = []
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();

  ngOnInit (): void {
    this.getUsersWithRoles();
  }

  openRolesModal (user: User) {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'User roles',
        username: user.username,
        selectedRoles: [...user.roles],
        availableRoles: ['Admin', 'Moderator', 'Member'],
        users: this.users,
        rolesUpdated: false
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, initialState)
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef?.content?.rolesUpdated)
        {
          const selectedRoles = this.bsModalRef.content.selectedRoles
          this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

  getUsersWithRoles () {
    this.adminService.getUserWithRoles().subscribe({
      next: users => this.users = users
    })

  }
}
