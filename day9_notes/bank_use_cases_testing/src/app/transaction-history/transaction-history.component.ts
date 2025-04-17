import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transaction-history', // Component selector for identifying it in HTML
  templateUrl: './transaction-history.component.html', // Path to the HTML template for this component
  styleUrls: ['./transaction-history.component.css'] // Path to the CSS file for styling this component
})
export class TransactionHistoryComponent implements OnInit {
  transactions: any[] = [];  // Array to store transaction history data from the service
  displayedColumns: string[] = ['date', 'fromAccount', 'description', 'amount']; // Columns to display in the table for transaction history
  errorMessage: string = '';  // Variable to hold an error message in case the transaction history fetch fails

  // Injecting the TransactionService into the component to access its methods
  constructor(private transactionService: TransactionService) { }

  // ngOnInit lifecycle hook is called once the component is initialized
  ngOnInit(): void {
    this.getTransactionHistory();  // Fetch the transaction history when the component is initialized
  }
  
  // Method to fetch transaction history from the TransactionService
  getTransactionHistory() {
    this.transactionService.getTransactionHistory().subscribe({
      next: (transactions) => {
        // On successful response, assign the returned transactions to the 'transactions' array
        this.transactions = transactions;
      },
      error: (error) => {
        // If there's an error, store the error message and reset the transactions array
        this.errorMessage = error; // Store the error message for display
        this.transactions = []; // Clear the transaction history on error
      }
    });
  }
}
