import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-account-details', // Defines the component's selector used in HTML
  templateUrl: './account-details.component.html', // Path to the HTML template
  styleUrls: ['./account-details.component.css'] // Path to the CSS styles
})
export class AccountDetailsComponent implements OnInit {
  // 'accounts' will store the list of account details fetched from the service
  accounts: any[] = [];

  // 'displayedColumns' defines the columns to be shown in the table
  displayedColumns: string[] = ['accountNumber', 'accountHolder', 'balance'];

  // Inject AccountService to fetch account data
  constructor(private accountService: AccountService) {}

  // ngOnInit is a lifecycle hook, called when the component is initialized
  ngOnInit(): void {
    // Fetch account details when the component initializes
    this.getAccountDetails();
  }

  // Method to fetch account details from the AccountService
  getAccountDetails() {
    // Call the service method and handle the Observable response
    this.accountService.getAccountDetails().subscribe({
      next: (data) => { // Handle successful response (data)
        console.log('Data received in component:', data);
        // Assign the received data to the accounts array
        this.accounts = data;
      },
      error: (error) => { // Handle error response
        console.error('Error fetching account details:', error);
        // Optional: You can add user-friendly error messages or UI updates here
      },
      complete: () => { // This block executes when the Observable completes
        console.log('Account details fetch complete.');
      }
    });
  }
}
