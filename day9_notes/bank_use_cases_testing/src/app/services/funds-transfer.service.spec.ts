import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FundsTransferService } from './funds-transfer.service';

/**
 * @description Test suite for the FundsTransferService.
 */
describe('FundsTransferService', () => {
  let service: FundsTransferService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    /**
     * @description Create a mock HttpClient and configure the testing module.
     */
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post']);

    TestBed.configureTestingModule({
      providers: [
        FundsTransferService,
        { provide: HttpClient, useValue: httpClientSpy } // Provide the mock HttpClient
      ],
    });

    service = TestBed.inject(FundsTransferService);
  });

  /**
   * @description Test case: Successful funds transfer.
   * Verifies that the service correctly transfers funds when valid input is provided.
   */
  it('should transfer funds successfully', (done) => {
    const transferDetails = { fromAccount: '1234567890', toAccount: '0987654321', amount: 100 };
    const mockAccounts = [
      { accountNumber: '1234567890', accountHolder: 'John Doe', balance: 2421, id: "61e2" },
      { accountNumber: '0987654321', accountHolder: 'Jane Smith', balance: 6000, id: "e4da" },
      { accountNumber: '1122334455', accountHolder: 'Alice Johnson', balance: 5345, id: "a8e0" }
    ];
    const mockFromAccount = { ...mockAccounts[0] }; // Create a copy to avoid modifying the original mock data
    const mockToAccount = { ...mockAccounts[1] }; // Create a copy to avoid modifying the original mock data
    mockFromAccount.balance = 2421 - transferDetails.amount; // Update the balance of the mock fromAccount
    mockToAccount.balance = 6000 + transferDetails.amount; // Update the balance of the mock toAccount

    const expectedTransaction = {
      transactionId: jasmine.any(String), // Use jasmine.any(String) for dynamically generated values
      date: jasmine.any(String), // Use jasmine.any(String) for dynamically generated values
      description: `Transfer to ${transferDetails.toAccount}`,
      amount: transferDetails.amount,
      fromAccount: transferDetails.fromAccount,
      toAccount: transferDetails.toAccount,
      transactionType: 'Transfer'
    };

    const expectedTransfer = {
      transferId: jasmine.any(String), // Use jasmine.any(String) for dynamically generated values
      fromAccount: transferDetails.fromAccount,
      toAccount: transferDetails.toAccount,
      amount: transferDetails.amount,
      date: jasmine.any(String), // Use jasmine.any(String) for dynamically generated values
      status: 'Success'
    };

    // Mock the HTTP responses
    httpClientSpy.get.and.returnValues(of(mockAccounts), of(mockFromAccount), of(mockToAccount), of(mockToAccount));
    httpClientSpy.put.and.returnValues(of(mockFromAccount), of(mockToAccount));
    httpClientSpy.post.and.returnValues(of({}), of({}));

    service.transferFunds(transferDetails).subscribe({
      next: (response) => {
        expect(response).toBeTruthy(); // Check if the response is truthy (you might want more specific checks)
        done(); // Signal that the asynchronous test is complete
      },
      error: (error) => {
        fail("Transfer should have succeeded, but got error: " + error.message); // Fail the test if an error is received
        done();
      }
    });

    // Verify that the HTTP methods were called with the correct arguments
    expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:3000/accounts');
    expect(httpClientSpy.get).toHaveBeenCalledWith(`http://localhost:3000/accounts/${mockFromAccount.id}`);
    expect(httpClientSpy.get).toHaveBeenCalledWith(`http://localhost:3000/accounts/${mockToAccount.id}`);
    expect(httpClientSpy.get).toHaveBeenCalledWith(`http://localhost:3000/accounts/${mockToAccount.id}`); // Verify the refetch

    expect(httpClientSpy.put).toHaveBeenCalledWith(`http://localhost:3000/accounts/${mockFromAccount.id}`, mockFromAccount);
    expect(httpClientSpy.put).toHaveBeenCalledWith(`http://localhost:3000/accounts/${mockToAccount.id}`, mockToAccount);

    // Verify POST calls with jasmine.objectContaining and correct call order
    expect(httpClientSpy.post.calls.argsFor(0)).toEqual(['http://localhost:3000/transactions', jasmine.objectContaining(expectedTransaction)]);
    expect(httpClientSpy.post.calls.argsFor(1)).toEqual(['http://localhost:3000/transfers', jasmine.objectContaining(expectedTransfer)]);
  });

  /**
   * @description Test case: Invalid account number.
   * Verifies that the service handles invalid account numbers.
   */
  it('should handle error during funds transfer - invalid account', (done) => {
    const transferDetails = { fromAccount: '12345', toAccount: '0987654321', amount: 100 }; // Invalid fromAccount
    const mockAccounts = [
      { accountNumber: '1234567890', accountHolder: 'John Doe', balance: 2421, id: "61e2" },
      { accountNumber: '0987654321', accountHolder: 'Jane Smith', balance: 6000, id: "e4da" },
      { accountNumber: '1122334455', accountHolder: 'Alice Johnson', balance: 5345, id: "a8e0" }
    ];

    httpClientSpy.get.and.returnValue(of(mockAccounts)); // Mock the initial get call

    service.transferFunds(transferDetails).subscribe({
      next: () => fail('expected an error, not success'), // The test should fail if next is called
      error: (error: any) => {
        expect(error.message).toContain('Invalid account numbers'); // Check for the correct error message
        done(); // Signal that the asynchronous test is complete
      },
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:3000/accounts'); // Verify the get call
  });

  /**
   * @description Test case: Transfer to the same account.
   * Verifies that the service prevents transfers to the same account.
   */
  it('should handle error during funds transfer - same account transfer', (done) => {
    const transferDetails = { fromAccount: '1234567890', toAccount: '1234567890', amount: 100 }; // Same account
    const mockAccounts = [
      { accountNumber: '1234567890', accountHolder: 'John Doe', balance: 2421, id: "61e2" },
      { accountNumber: '0987654321', accountHolder: 'Jane Smith', balance: 6000, id: "e4da" },
      { accountNumber: '1122334455', accountHolder: 'Alice Johnson', balance: 5345, id: "a8e0" }
    ];

    httpClientSpy.get.and.returnValue(of(mockAccounts)); // Mock the initial get call

    service.transferFunds(transferDetails).subscribe({
      next: () => fail('expected an error, not success'), // The test should fail if next is called
      error: (error: any) => {
        expect(error.message).toContain('From and To account cannot be the same'); // Check for the correct error message
        done(); // Signal that the asynchronous test is complete
      },
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:3000/accounts'); // Verify the get call
  });

  /**
 * @description Test case: Insufficient balance.
 * Verifies that the service correctly handles the scenario where the 'from' account has insufficient funds
 * to complete the transfer.  It mocks the account retrieval and checks for the appropriate error message.
 */
it('should handle error during funds transfer - insufficient balance', (done) => {
  const transferDetails = { fromAccount: '1234567890', toAccount: '0987654321', amount: 5000 }; // Transfer amount exceeds balance
  const mockAccounts = [
    { accountNumber: '1234567890', accountHolder: 'John Doe', balance: 2421, id: "61e2" },
    { accountNumber: '0987654321', accountHolder: 'Jane Smith', balance: 6000, id: "e4da" },
    { accountNumber: '1122334455', accountHolder: 'Alice Johnson', balance: 5345, id: "a8e0" }
  ];
  const mockFromAccount = { ...mockAccounts[0] }; // Create a copy to avoid modifying the original mock data
  mockFromAccount.balance = 2421; // Initial balance (insufficient for the transfer)
  const mockFromAccountId = mockFromAccount.id; // Get the ID separately (not used in this test but kept for consistency)

  httpClientSpy.get.and.returnValues(of(mockAccounts), of(mockFromAccount)); // Mock the GET calls, returning mockAccounts initially, then mockFromAccount

  service.transferFunds(transferDetails).subscribe({
    next: () => fail('expected an error, not success'), // The test should fail if next is called (transfer should not succeed)
    error: (error: any) => {
      expect(error.message).toContain('Insufficient balance'); // Check if the error message contains the expected text
      done(); // Signal that the asynchronous test is complete
    },
  });

  expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:3000/accounts'); // Verify that the initial GET call to retrieve accounts was made

});

});