import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService; // Declare a variable for the TransactionService instance
  let httpClientSpy: { get: jasmine.Spy }; // Declare a spy object to mock the HttpClient's 'get' method

  beforeEach(() => {
    // Create a spy object for HttpClient with the 'get' method to mock HTTP requests
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']); 

    // Configure the TestBed with the necessary providers
    TestBed.configureTestingModule({
      providers: [
        TransactionService, // Provide the service that will be tested
        { provide: HttpClient, useValue: httpClientSpy }, // Use the spy object for HttpClient
      ],
    });

    // Inject the service into the test and assign it to the service variable
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    // Verify that the service is created successfully
    expect(service).toBeTruthy();
  });

  it('should fetch transaction history', () => {
    // Define mock transaction data to simulate the expected response from the API
    const mockTransactions = [
      { fromAccount: '12345', toAccount: '67890', amount: 100 },
      { fromAccount: '1122334455', toAccount: '1234567890', amount: 100 }
    ];

    // Mock the 'get' method of HttpClient to return the mock transaction data
    httpClientSpy.get.and.returnValue(of(mockTransactions)); // Return an observable with the mock data

    // Call the service method to get transaction history
    service.getTransactionHistory().subscribe(transactions => {
      // Verify that the returned transactions match the mock data
      expect(transactions).toEqual(mockTransactions);
    });

    // Ensure that the 'get' method was called exactly once
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching transaction history', () => {
    const errorMessage = 'Error fetching transactions. Please try again later.'; // Define a mock error message

    // Mock the 'get' method to simulate an error (using throwError)
    httpClientSpy.get.and.returnValue(throwError(() => errorMessage)); // Return an observable that throws the error

    // Call the service method and subscribe to handle errors
    service.getTransactionHistory().subscribe({
      next: () => fail('Should not receive transaction data'), // Fail the test if data is received unexpectedly
      error: (error) => {
        // Verify that the error message contains the expected error
        expect(error).toContain(errorMessage); 
      },
    });

    // Ensure that the 'get' method was called exactly once
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });
});
