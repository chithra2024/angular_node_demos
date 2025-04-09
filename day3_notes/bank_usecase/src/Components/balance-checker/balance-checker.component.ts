import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-balance-checker',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HighlightDirective],
  
  templateUrl: "./balance-checker.component.html"
  
})
export class BalanceCheckerComponent {
  balanceForm: FormGroup;
  balance: number | null = null;
  errorMessage: string = '';

  // Mock data for accounts
  private accounts = [
    { accountNumber: 101, balance: 5000 },
    { accountNumber: 102, balance: 10000 },
    { accountNumber: 103, balance: 7500 },
  ];

  constructor(private fb: FormBuilder) {
    this.balanceForm = this.fb.group({
      accountNumber: ['', [Validators.required]],
    });
  }

  checkBalance() {
    const accountNumber = this.balanceForm.get('accountNumber')?.value;
    const account = this.accounts.find((acc) => acc.accountNumber === accountNumber);

    if (account) {
      this.balance = account.balance;
      this.errorMessage = '';
    } else {
      this.balance = null;
      this.errorMessage = 'Account not found. Please check the account number.';
    }
  }
}
