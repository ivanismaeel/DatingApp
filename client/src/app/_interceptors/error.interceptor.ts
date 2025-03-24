import {ToastrService} from 'ngx-toastr';
import {NavigationExtras, Router} from '@angular/router';
import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError} from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const Toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((err) => {
      if (err)
      {
        switch (err.status)
        {
          case 400:
            if (err.error.errors)
            {
              const modalStateErrors = [];
              // for(const item of Object.values(err.error.errors)){
              //   modalStateErrors.push(item)
              // }
              for (const key in err.error.errors)
              {
                if (err.error.errors[key])
                {
                  modalStateErrors.push(err.error.errors[key]);
                }
              }
              throw modalStateErrors.flat();
            } else
            {
              Toastr.error(err.error, err.status);
            }
            break;
          case 401:
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = {
              state: {error: err.error},
            };
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            Toastr.error('Something went wrong');
            break;
        }
      }
      throw err;
    })
  );
};
