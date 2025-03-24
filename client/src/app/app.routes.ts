import {Routes} from '@angular/router';

import {preventUnsavedChangesGuard} from './_guards/prevent-unsaved-changes.guard';
import {memberDetailedResolver} from './_resolvers/member-detailed.resolver';
import {adminGuard} from './_guards/admin.guard';
import {authGuard} from './_guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canMatch: [authGuard],
    children: [
      {
        path: 'members',
        loadComponent: () =>
          import('./members/member-list/member-list.component').then(
            (c) => c.MemberListComponent
          ),
      },
      {
        path: 'members/:username',
        loadComponent: () =>
          import('./members/member-detail/member-detail.component').then(
            (c) => c.MemberDetailComponent
          ),
        resolve: {
          member: memberDetailedResolver
        }
      },
      {
        path: 'member/edit',
        loadComponent: () =>
          import('./members/member-edit/member-edit.component').then(
            (c) => c.MemberEditComponent
          ),
        canDeactivate: [preventUnsavedChangesGuard]
      },

      {
        path: 'lists',
        loadComponent: () =>
          import('./lists/lists.component').then((c) => c.ListsComponent),
      },
      {
        path: 'message',
        loadComponent: () =>
          import('./messages/messages.component').then(
            (c) => c.MessagesComponent
          ),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./admin/admin-panel/admin-panel.component').then((c) => c.AdminPanelComponent),
        canMatch: [adminGuard]
      }
    ],
  },
  {
    path: 'errors',
    loadComponent: () =>
      import('./errors/test-errors/test-errors.component').then(
        (c) => c.TestErrorsComponent
      ),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./errors/not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./errors/server-error/server-error.component').then(
        (c) => c.ServerErrorComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
    pathMatch: 'full',
  },
];
