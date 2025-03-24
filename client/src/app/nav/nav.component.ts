import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ToastrService} from 'ngx-toastr';

import {UserModel} from '../_models/userModel';
import {AccountService} from './../_services/account.service';
import {HasRoleDirective} from '../_directives/has-role.directive';

@Component({
  selector: 'app-nav',
  imports: [
    FormsModule,
    BsDropdownModule,
    RouterLink,
    RouterLinkActive,
    HasRoleDirective
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  model: UserModel = {} as UserModel;
  member = this.accountService.currentUser

  login () {
    this.accountService.login(this.model).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/members');
        this.toastr.success('Logged in successfully');
      },
      error: (err) => this.toastr.error(err.error),
    });
  }

  logout () {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toastr.success('Logged out successfully');
  }
}
