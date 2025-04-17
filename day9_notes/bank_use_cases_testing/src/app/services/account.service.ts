import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',  // Mark the service as available globally in the app
})
export class AccountService {
  private apiUrl = 'http://localhost:3000/accounts';  // API URL for fetching account details from the backend

  constructor(private http: HttpClient) {}  // Inject HttpClient into the service to make HTTP requests

  // Method to fetch account details from the API
  getAccountDetails(): Observable<any> {
    return this.http.get<any>(this.apiUrl)  // Make a GET request to the API URL and expect a response of type 'any'
      .pipe(
        catchError((error: HttpErrorResponse) => {  // Catch any errors that occur during the HTTP request
          console.error("Error fetching account details:", error);  // Log the full error to the console for debugging
          return throwError(() => 'Error fetching account details');  // Return a new error observable with a user-friendly error message
        })
      );
  }
}
