import {Component, inject} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  imports: [],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent {
  bsModalRef = inject(BsModalRef)

  username = ''
  title = ''
  rolesUpdated = false
  availableRoles: string[] = []
  selectedRoles: string[] = []

  updateChecked (checkedValue: string) {
    if (this.selectedRoles.includes(checkedValue))
    {
      this.selectedRoles = this.selectedRoles.filter(role => role !== checkedValue)
    } else
    {
      this.selectedRoles.push(checkedValue)
    }
  }

  onSelectedRoles () {
    this.rolesUpdated = true
    this.bsModalRef.hide()
  }
}
