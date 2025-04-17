import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService; // Declare a variable for the AccountService instance
  let httpClientSpy: { get: jasmine.Spy }; // Declare a spy object for HttpClient to mock its 'get' method

  beforeEach(() => {
    // Create a spy object for HttpClient with the 'get' method to mock HTTP requests
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    // Configure the TestBed for the AccountService, providing the spy object for HttpClient
    TestBed.configureTestingModule({
      providers: [
        AccountService,  // Provide the AccountService for testing
        { provide: HttpClient, useValue: httpClientSpy }, // Use the spy object in place of the actual HttpClient
      ],
    });

    // Inject the AccountService and assign it to the service variable
    service = TestBed.inject(AccountService);
  });

  it('should fetch account details successfully', () => { // Positive test case for successful data fetching
    const mockAccountDetails = { fromAccount: '12345', toAccount: '67890', amount: 100 }; // Mock account details

    // Mock the get method of HttpClient to return an observable with mock account details
    httpClientSpy.get.and.returnValue(of(mockAccountDetails));

    // Call the service method and check the result
    service.getAccountDetails().subscribe({
      next: (accountDetails) => {
        // Verify that the account details returned from the service match the mock data
        expect(accountDetails).toEqual(mockAccountDetails);
      },
      error: () => fail('Should not have encountered an error'), // Ensure no error is encountered in the success case
    });

    // Verify that the get method was called exactly once
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should handle error response', fakeAsync(() => { // Test case for handling error during HTTP request
    const errorMessage = 'Error fetching account details'; // Mock error message

    // Create a mock HttpErrorResponse with a 500 status (Internal Server Error)
    const httpErrorResponse = new HttpErrorResponse({
      error: { message: errorMessage },
      status: 500,
      statusText: 'Internal Server Error',
    });

    // Mock the get method to return an observable that emits an error (HttpErrorResponse)
    httpClientSpy.get.and.returnValue(throwError(() => httpErrorResponse));

    let caughtError: HttpErrorResponse | null = null; // Variable to capture the error

    // Call the service method and expect it to throw an error
    service.getAccountDetails().subscribe({
      next: () => fail('expected an error, not account details'), // Fail the test if account details are returned instead of an error
      error: (error: HttpErrorResponse) => {
        caughtError = error; // Capture the error in the 'caughtError' variable
      },
    });

    tick(); // Simulate the passage of time to resolve the observable

    // Now check the error
    expect(caughtError).not.toBeNull(); // Ensure that an error was caught
    if (caughtError) {
      // Verify that the caught error contains the expected error message
      const actualErrorMessage = typeof caughtError === 'string' ? caughtError : null;
      expect(actualErrorMessage).toContain(errorMessage);
    }

    // Verify that the get method was called exactly once
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  }));
});
