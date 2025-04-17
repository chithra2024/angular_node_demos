import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';

/**
 * @ngInjectable
 * @description This service handles funds transfer logic, communicating with the backend API.
 */
@Injectable({
  providedIn: 'root'
})
export class FundsTransferService {
  /**
   * @property apiUrl
   * @description The base URL for the backend API.
   * @type {string}
   */
  private apiUrl = 'http://localhost:3000'; // Or your actual API URL

  /**
   * @constructor
   * @param {HttpClient} http - The Angular HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method transferFunds
   * @description Transfers funds between two accounts.
   * Fetches account details, validates input, updates balances, and records the transaction.
   * Uses RxJS operators for asynchronous operations and error handling.
   * @param {any} transferDetails - An object containing the transfer details (fromAccount, toAccount, amount).
   * @returns {Observable<any>} - An Observable that emits the result of the transfer operation.
   */
  transferFunds(transferDetails: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/accounts`).pipe(
      catchError(this.handleError), // Handle errors during account retrieval
      switchMap((accounts) => {  // Switch to the next observable after account retrieval
        const fromAccount = accounts.find(account => account.accountNumber === transferDetails.fromAccount);
        const toAccount = accounts.find(account => account.accountNumber === transferDetails.toAccount);

        // Validate account numbers
        if (!fromAccount || !toAccount) {
          return throwError(() => new Error('Invalid account numbers.'));
        }

        // Validate same account transfer
        if (transferDetails.fromAccount === transferDetails.toAccount) {
          return throwError(() => new Error('From and To account cannot be the same.'));
        }

        // Validate sufficient balance
        if (fromAccount.balance < transferDetails.amount) {
          return throwError(() => new Error('Insufficient balance.'));
        }

        // Fetch full account details for fromAccount
        return this.http.get<any>(`${this.apiUrl}/accounts/${fromAccount.id}`).pipe(
          catchError(this.handleError),
          switchMap((fullFromAccount) => {
            // Fetch full account details for toAccount
            return this.http.get<any>(`${this.apiUrl}/accounts/${toAccount.id}`).pipe(
              catchError(this.handleError),
              switchMap((fullToAccount) => {
                // Create new transaction and transfer objects
                const newTransaction = {
                  transactionId: crypto.randomUUID(),
                  date: new Date().toISOString(),
                  description: `Transfer to ${transferDetails.toAccount}`,
                  amount: transferDetails.amount,
                  fromAccount: transferDetails.fromAccount,
                  toAccount: transferDetails.toAccount,
                  transactionType: 'Transfer'
                };

                const newTransfer = {
                  transferId: crypto.randomUUID(),
                  fromAccount: transferDetails.fromAccount,
                  toAccount: transferDetails.toAccount,
                  amount: transferDetails.amount,
                  date: new Date().toISOString(),
                  status: 'Success'
                };

                // Update account balances
                fullFromAccount.balance -= transferDetails.amount;
                fullToAccount.balance += transferDetails.amount;

                const updatedFromAccount = { ...fullFromAccount };

                // *** Explicitly handle ID type - adapt as needed ***
                const fromAccountId = typeof fromAccount.id === 'number' ? +fromAccount.id : fromAccount.id; // Convert if number
                const toAccountId = typeof toAccount.id === 'number' ? +toAccount.id : toAccount.id;   // Convert if number

                // Update fromAccount balance
                return this.http.put(`${this.apiUrl}/accounts/${fromAccountId}`, updatedFromAccount).pipe(
                  catchError(this.handleError),
                  concatMap(() => { // Use concatMap to ensure sequential execution
                    // Refetch toAccount to get latest balance
                    return this.http.get<any>(`${this.apiUrl}/accounts/${toAccountId}`).pipe(
                      catchError(this.handleError),
                      tap((refreshedToAccount) => { // Update toAccount balance
                        fullToAccount.balance = refreshedToAccount.balance;
                      }),
                      concatMap(() => { // Update toAccount balance
                        return this.http.put(`${this.apiUrl}/accounts/${toAccountId}`, fullToAccount).pipe(
                          catchError(this.handleError),
                          concatMap(() => { // Create transaction record
                            return this.http.post(`${this.apiUrl}/transactions`, newTransaction).pipe(
                              catchError(this.handleError),
                              concatMap(() => this.http.post(`${this.apiUrl}/transfers`, newTransfer).pipe( // Create transfer record
                                catchError(this.handleError)
                              ))
                            );
                          })
                        );
                      })
                    );
                  })
                );
              })
            );
          })
        );
      })
    );
  }

  /**
   * @private
   * @method handleError
   * @description Handles errors that occur during HTTP requests.
   * Logs the error to the console and returns an Observable with a user-friendly error message.
   * @param {any} error - The error object.
   * @returns {Observable<any>} - An Observable that emits an error.
   */
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error.message || 'An error occurred. Please try again later.');
  }
}