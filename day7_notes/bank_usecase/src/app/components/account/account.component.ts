import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  imports: [FormsModule,CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  standalone: true,
  providers: []
})
export class AccountComponent  implements OnInit {
  accounts: Account[]= [];
  newAccount: Partial<Account> = {};
  editingAccount: Account | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
   // this.loadAccounts();
 //  console.log('calling ngOnInit')
    this.loadAccounts();
  //  this.accountService.getAccounts().subscribe((data) =>{
  //   console.log('data ....',data);
  //   this.accounts = data;
  // } );
}

  loadAccounts(): void {
  //  console.log('Loading accounts');
    this.accountService.getAccounts().subscribe( {
      next: (data) => {
        console.log('Fetched accounts:', data);
        this.accounts = data;
      },
      error: (err) => {
        console.error('Error:', err);
      },
      complete: () => {
        console.log('Observable completed'); // Logs on completion
      }
    });
     
  }
  onSubmit(event:Event): void {
    console.log('Form submitted');
    event.preventDefault();
    this.addAccount();
  }

  addAccount(): void {
   // console.log('Adding account ................' ,this.newAccount);
    if (this.newAccount.accountHolderName && this.newAccount.balance) {
      if (this.newAccount.balance < 0) {
        alert('Balance cannot be negative');
        return;
      }
      const newId =this.accounts.length > 0
      ? Math.max(...this.accounts.map((acc) => parseInt(acc.accountNumber)), 0) + 1
      : 1;
      this.newAccount.accountNumber = newId.toString();
       //console.log('**** New Account',this.newAccount);

      this.accountService.addAccount(this.newAccount).subscribe((response) => {
       // console.log('Response from add account',response);
        this.loadAccounts();
        this.newAccount = {};
      });
    }
    else {
      alert('Please enter account holder name and balance');
    }
  }

  editAccount(account: Account): void {
    this.editingAccount = { ...account };
  }

  updateAccount(): void {
    console.log('Updating account:', this.editingAccount);


    if (this.editingAccount) {
      console.log('Updating account:', this.editingAccount.accountHolderName, this.editingAccount.balance);
      if (this.editingAccount.accountHolderName && this.editingAccount.balance) {
        if (this.editingAccount.balance < 0) {
          alert('Balance cannot be negative');
          return;
        }
      this.accountService
        .updateAccount(this.editingAccount)
        .subscribe(() => {
          this.editingAccount = null;
          this.loadAccounts();
        });
    }
    else {
      console.log('Account holder name and balance are required');
      alert('Account holder name and balance are required');
    }
  }

  }

  // deleteAccount(id: number): void {
  //   this.accountService.deleteAccount(id).subscribe(() => this.loadAccounts());
  // }

  deleteAccount(id: number): void {
    this.accountService.deleteAccount(id).subscribe({
      next: () => {
        this.loadAccounts();  // Reload accounts after deletion
      },
      error: (err) => {
        console.error('Error:', err);  // Ensure error is logged here
        alert('Failed to delete the account');  // Optionally, show an alert
      }
    });
  }

  cancelEdit(): void {
    this.editingAccount = null;
  }
}

