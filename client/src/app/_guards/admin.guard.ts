import {inject} from '@angular/core';
import {CanMatchFn, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

import {AccountService} from './../_services/account.service';

export const adminGuard: CanMatchFn = (route, segments) => {

  const accountService = inject(AccountService)
  const router = inject(Router)
  const toastr = inject(ToastrService)

  if (accountService.roles().includes('Admin') || accountService.roles().includes('Moderator')) return true

  toastr.error('You cannot enter this area')
  router.navigateByUrl('/members')

  return false;
};
