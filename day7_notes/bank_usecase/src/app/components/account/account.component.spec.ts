import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { AccountService } from '../../services/account.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let accountService: AccountService;

  const mockAccounts = [
    { id: 1, accountNumber: '1001', accountHolderName: 'John Doe', balance: 500 },
    { id: 2, accountNumber: '1002', accountHolderName: 'Jane Smith', balance: 1000 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule,AccountComponent],
      providers: [
        AccountService,
        provideHttpClient(withInterceptorsFromDi()), // New HttpClient setup
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    accountService = TestBed.inject(AccountService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load accounts on init', fakeAsync(() => {
    spyOn(accountService, 'getAccounts').and.returnValue(of(mockAccounts));

    component.ngOnInit();
    tick();

    expect(component.accounts.length).toBe(2);
    expect(component.accounts).toEqual(mockAccounts);
  }));


  it('should handle error when loading accounts', fakeAsync(() => {
    spyOn(accountService, 'getAccounts').and.returnValue(throwError(() => new Error('Server error')));
    spyOn(console, 'error');

    component.loadAccounts();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error:', new Error('Server error'));
  }));

  it('should add an account successfully', fakeAsync(() => {
    const newAccount = { accountHolderName: 'Alice Brown', balance: 1500 };
    const addedAccount = { id: 3, accountNumber: '1003', ...newAccount };

    spyOn(accountService, 'addAccount').and.returnValue(of(addedAccount));
    spyOn(component, 'loadAccounts');

    component.newAccount = newAccount;
    component.addAccount();
    tick();

    expect(accountService.addAccount).toHaveBeenCalledWith(newAccount);
    expect(component.loadAccounts).toHaveBeenCalled();
    expect(component.newAccount).toEqual({});
  }));

  it('should not add an account if details are missing', () => {
    spyOn(window, 'alert');

    component.newAccount = {};
    component.addAccount();

    expect(window.alert).toHaveBeenCalledWith('Please enter account holder name and balance');
  });

  it('should not add an account if accountHolderName is  missing', () => {
    spyOn(window, 'alert');

    component.newAccount = {accountHolderName:'', balance: 1500 };
    component.addAccount();

    expect(window.alert).toHaveBeenCalledWith('Please enter account holder name and balance');
  });

  it('should not add an account if balance  is  missing', () => {
    spyOn(window, 'alert');

    component.newAccount = {accountHolderName:'ABCD'};
    component.addAccount();

    expect(window.alert).toHaveBeenCalledWith('Please enter account holder name and balance');
  });

  it('should not add an account if balance  is  negative', () => {
    spyOn(window, 'alert');

    component.newAccount = {accountHolderName:'ABCD' ,balance: -1500};
    component.addAccount();

    expect(window.alert).toHaveBeenCalledWith('Balance cannot be negative');
  });


  it('should set editingAccount when editing an account', () => {
    component.editAccount(mockAccounts[0]);

    expect(component.editingAccount).toEqual(mockAccounts[0]);
  });

  it('should update an account successfully', fakeAsync(() => {
    const updatedAccount = { id: 1, accountNumber: '1001', accountHolderName: 'John Doe Updated', balance: 600 };

    spyOn(accountService, 'updateAccount').and.returnValue(of(updatedAccount));
    spyOn(component, 'loadAccounts');

    component.editingAccount = updatedAccount;
    component.updateAccount();
    tick();

    expect(accountService.updateAccount).toHaveBeenCalledWith(updatedAccount);
    expect(component.loadAccounts).toHaveBeenCalled();
    expect(component.editingAccount).toBeNull();
  }));

  it('should not update an account if details are missing', () => {
    spyOn(window, 'alert');

    component.editingAccount = { id: 1, accountNumber: '1001', accountHolderName: '', balance: 600 };
    component.updateAccount();

    expect(window.alert).toHaveBeenCalledWith('Account holder name and balance are required');
  });

  it('should not update an account if balance is  missing', () => {
    spyOn(window, 'alert');

    component.editingAccount = { id: 1, accountNumber: '1001', accountHolderName: 'John Doe', balance: 0 };
    component.updateAccount();

    expect(window.alert).toHaveBeenCalledWith('Account holder name and balance are required');
  });

  it('should not update an account if balance is  negative', () => {
    spyOn(window, 'alert');

    component.editingAccount = { id: 1, accountNumber: '1001', accountHolderName: 'John Doe', balance: -1000};
    component.updateAccount();

    expect(window.alert).toHaveBeenCalledWith('Balance cannot be negative');
  });


  it('should delete an account', fakeAsync(() => {
    spyOn(accountService, 'deleteAccount').and.returnValue(of(undefined));
    spyOn(component, 'loadAccounts');

    component.deleteAccount(1);
    tick();

    expect(accountService.deleteAccount).toHaveBeenCalledWith(1);
    expect(component.loadAccounts).toHaveBeenCalled();
  }));

 
  
  it('should handle delete account failure', fakeAsync(() => {
    spyOn(accountService, 'deleteAccount').and.returnValue(throwError(() => new Error('Delete failed')));
    spyOn(console, 'error');

    component.deleteAccount(1);
    tick();

    expect(accountService.deleteAccount).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith('Error:', new Error('Delete failed'));
  }));


  it('should cancel edit and reset editingAccount', () => {
    component.editingAccount = mockAccounts[0];

    component.cancelEdit();

    expect(component.editingAccount).toBeNull();
  });
});
