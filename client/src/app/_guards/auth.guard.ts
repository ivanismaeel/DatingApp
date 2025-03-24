import {inject} from '@angular/core';
import {CanMatchFn, Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';

import {AccountService} from '../_services/account.service';

export const authGuard: CanMatchFn = (route, segments) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  const toastr = inject(ToastrService);

  if (!accountService.currentUser())
  {
    toastr.error('Please login first');
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
