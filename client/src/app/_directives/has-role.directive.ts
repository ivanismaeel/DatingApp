import {AccountService} from './../_services/account.service';
import {Directive, inject, input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {

  appHasRole = input<string[]>([])

  private readonly accountService = inject(AccountService)
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly templateRef = inject(TemplateRef)

  ngOnInit (): void {

    this.accountService.roles()?.some((r: string) => this.appHasRole().includes(r))
      ? this.viewContainerRef.createEmbeddedView(this.templateRef)
      : this.viewContainerRef.clear()
  }

}
