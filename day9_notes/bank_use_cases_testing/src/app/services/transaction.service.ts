import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Make this service available throughout the entire application at the root level
})
export class TransactionService {

  private apiUrl = 'http://localhost:3000/transactions';  // API URL for fetching transaction history

  constructor(private http: HttpClient) { } // Inject HttpClient into the service to make HTTP requests

  // Method to get transaction history
  getTransactionHistory(): Observable<any[]> {
    // Send a GET request to the API to fetch transaction data
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Handle any errors that occur during the HTTP request
    );
  }

  // Error handling function to process and log errors
  private handleError(error: any) {
    console.error('An error occurred:', error); // Log the error for debugging purposes

    // Return an observable with a user-friendly error message
    return throwError(() => 'Error fetching transactions. Please try again later.');
  }
}
