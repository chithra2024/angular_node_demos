import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:3000/accounts';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  addAccount(account: Partial<Account>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${account.id}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
