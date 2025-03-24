import {Component, inject, output, signal} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {DatePickerComponent} from "../_forms/date-picker/date-picker.component";
import {TextInputComponent} from "../_forms/text-input/text-input.component";
import {UserModel} from '../_models/userModel';
import {AccountService} from './../_services/account.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  cancelRegister = output<boolean>();
  maxDate = new Date();
  validationErrors = signal<string[] | null>([])
  registerForm: FormGroup = new FormGroup({})

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  ngOnInit (): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm () {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required,],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValidator('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValidator (matchTo: string) {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true};
    }
  }
  register () {
    this.validationErrors.set(null);
    if (this.registerForm.invalid) return;
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    if (!dob) return;
    this.registerForm.patchValue({dateOfBirth: dob});
    const user: UserModel = this.registerForm.value;
    this.accountService.register(user).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        this.validationErrors.set(error);
      }
    });
  }

  cancel () {
    this.cancelRegister.emit(false);
  }

  private getDateOnly (dob: string | undefined) {
    if (!dob) return null;

    const date = new Date(dob).toISOString().slice(0, 10)
    return date;
  }
}
