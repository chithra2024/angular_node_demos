import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { of, throwError } from 'rxjs';
import { TransactionService } from '../services/transaction.service';
import { TransactionHistoryComponent } from './transaction-history.component';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent; // Declare the component instance
  let fixture: ComponentFixture<TransactionHistoryComponent>; // Declare the test fixture to create and interact with the component
  let transactionService: jasmine.SpyObj<TransactionService>; // Declare a spy object for the TransactionService to mock its behavior

  // Run this block of code before each test
  beforeEach(async () => {
    // Create a spy for the TransactionService with a mock method for 'getTransactionHistory'
    transactionService = jasmine.createSpyObj('TransactionService', ['getTransactionHistory']);

    // Configure the testing module
    await TestBed.configureTestingModule({
      declarations: [TransactionHistoryComponent], // Declare the component under test
      imports: [MatTableModule], // Import the Angular Material Table module for displaying transaction data
      providers: [{ provide: TransactionService, useValue: transactionService }], // Provide the mocked service
    }).compileComponents(); // Compile the components
  });

  // This block is executed before each test
  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistoryComponent); // Create the component instance
    component = fixture.componentInstance; // Access the component instance
    // DO NOT call fixture.detectChanges() here! It should only be called after mocking the service response
  });

  // Test case for successfully loading transaction history
  it('should load transaction history successfully', fakeAsync(() => {
    // Mock transaction data to simulate a successful response
    const mockTransactions = [{ accountNumber: '12345', amount: 1000, date: '2025-01-21' }];
    // Mock the 'getTransactionHistory' method to return the mock data
    transactionService.getTransactionHistory.and.returnValue(of(mockTransactions));

    fixture.detectChanges(); // Trigger change detection (important after mocking the service)
    tick(); // Simulate the asynchronous passage of time

    // Assertions to check if the component's transactions were correctly populated
    expect(component.transactions).toEqual(mockTransactions); // Verify transactions are correctly assigned
    expect(component.errorMessage).toBe(''); // Verify no error message is set
  }));

  // Test case for handling errors when loading transaction history
  it('should handle error when loading transaction history', fakeAsync(() => {
    // Define the error message to be returned by the mocked service
    const errorMessage = 'Error fetching transactions. Please try again later.';
    // Mock the 'getTransactionHistory' method to simulate an error
    transactionService.getTransactionHistory.and.returnValue(throwError(() => errorMessage));

    fixture.detectChanges(); // Trigger change detection (important after mocking the service)
    tick(); // Simulate the asynchronous passage of time

    // Assertions to check if the component's transactions are cleared and the error message is set
    expect(component.transactions).toEqual([]); // Verify transactions are cleared on error
    expect(component.errorMessage).toBe(errorMessage); // Verify the error message is displayed
  }));
});
