import { ComponentFixture, TestBed } from '@angular/core/testing'; // Import TestBed and ComponentFixture for testing
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule to work with Angular Material Table
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Import NoopAnimationsModule to handle animations in tests
import { of } from 'rxjs'; // Import 'of' to mock observable responses
import { AccountService } from '../services/account.service'; // Import the AccountService
import { AccountDetailsComponent } from './account-details.component'; // Import the component being tested

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent; // Declare component variable
  let fixture: ComponentFixture<AccountDetailsComponent>; // Declare fixture to access the component's DOM and instance
  let accountService: jasmine.SpyObj<AccountService>; // Declare a spy object for the AccountService to mock service calls

  beforeEach(async () => {
    // Create a spy object for AccountService with the 'getAccountDetails' method
    const accountServiceSpy = jasmine.createSpyObj('AccountService', ['getAccountDetails']);

    // Configure the testing module for AccountDetailsComponent
    await TestBed.configureTestingModule({
      declarations: [AccountDetailsComponent], // Declare the component to be tested
      imports: [
        MatTableModule, // Import MatTableModule to enable the use of Angular Material Table in the component
        NoopAnimationsModule // Import NoopAnimationsModule to handle animations in the testing environment
      ],
      providers: [
        { provide: AccountService, useValue: accountServiceSpy } // Provide the mock service in place of the actual AccountService
      ]
    })
    .compileComponents(); // Compile the components for testing

    // Create the component fixture and initialize the component instance
    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance; // Get the instance of AccountDetailsComponent
    accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>; // Inject the mocked AccountService
  });

  it('should display account details in the table', () => {
    // Mock data representing account details that will be returned by the service
    const mockData = [
      { accountNumber: '12345', accountHolder: 'John Doe', balance: 1000 },
      { accountNumber: '67890', accountHolder: 'Jane Smith', balance: 2000 }
    ];

    // Mock the getAccountDetails method to return an observable with mockData
    accountService.getAccountDetails.and.returnValue(of(mockData));

    fixture.detectChanges();  // Trigger change detection to update the component view

    // Select all 'tr' (table row) elements in the component's rendered template
    const rows = fixture.nativeElement.querySelectorAll('tr');  

    // Verify that there are 3 rows in total: one for the header, and two for data rows
    expect(rows.length).toBe(3);

    // Verify that the text content of the first data row contains the account number '12345'
    expect(rows[1].textContent).toContain('12345');

    // Verify that the text content of the second data row contains the account number '67890'
    expect(rows[2].textContent).toContain('67890');
  });
});
