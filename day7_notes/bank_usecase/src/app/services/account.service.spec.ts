import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Account } from '../models/account';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService, provideHttpClient(),provideHttpClientTesting()],
      imports: [],

   });
    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch accounts', () => {
    const dummyAccounts: Account[] = [
      { id: 1, accountNumber: '12345', accountHolderName: 'John Doe', balance: 5000 },
      { id: 2, accountNumber: '12346', accountHolderName: 'Jane Smith', balance: 3000 }
    ];

    service.getAccounts().subscribe(accounts => {
      expect(accounts.length).toBe(2);
      expect(accounts).toEqual(dummyAccounts);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAccounts);
  });

  it('should add an account', () => {
    const newAccount: Partial<Account> = { accountNumber: '12347', accountHolderName: 'New User', balance: 1000 };

    service.addAccount(newAccount).subscribe(account => {
      expect(account.accountHolderName).toBe('New User');
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newAccount, id: 3 });
  });

  it('should update an account', () => {
    const updatedAccount: Account = { id: 1, accountNumber: '12345', accountHolderName: 'John Doe', balance: 6000 };

    service.updateAccount(updatedAccount).subscribe(account => {
      expect(account.balance).toBe(6000);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedAccount);
  });

  it('should delete an account', () => {
    service.deleteAccount(1).subscribe();
    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
