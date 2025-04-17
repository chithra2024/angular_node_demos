import { ComponentFixture, TestBed } from '@angular/core/testing'; // Import testing utilities from Angular
import { FormsModule } from '@angular/forms'; // Import FormsModule to handle form-related functionality in the test
import { of, throwError } from 'rxjs'; // Import 'of' and 'throwError' to mock observables
import { FundsTransferService } from '../services/funds-transfer.service'; // Import the FundsTransferService that is being tested
import { FundsTransferComponent } from './funds-transfer.component'; // Import the component being tested

describe('FundsTransferComponent', () => {
  let component: FundsTransferComponent; // Declare a variable for the component instance
  let fixture: ComponentFixture<FundsTransferComponent>; // Declare a fixture variable to interact with the component in the DOM
  let fundsTransferService: FundsTransferService; // Declare a variable to hold the service instance

  beforeEach(async () => {
    // Create a spy object for FundsTransferService with a 'transferFunds' method
    const fundsTransferServiceSpy = jasmine.createSpyObj('FundsTransferService', ['transferFunds']); 

    // Configure the testing module, including the component, FormsModule, and the mocked service
    await TestBed.configureTestingModule({
      declarations: [FundsTransferComponent],  // Declare the component to be tested
      imports: [FormsModule],  // Import FormsModule to handle form bindings
      providers: [
        { provide: FundsTransferService, useValue: fundsTransferServiceSpy }, // Provide the spy object in place of the actual service
      ],
    }).compileComponents(); // Compile the components for testing

    // Create the component fixture and instance
    fixture = TestBed.createComponent(FundsTransferComponent);
    component = fixture.componentInstance; // Get the instance of the component
    fundsTransferService = TestBed.inject(FundsTransferService); // Inject the spy instance of FundsTransferService
    fixture.detectChanges(); // Trigger change detection to initialize the component
  });

  // Test case to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy(); // Expect the component to be truthy (i.e., created successfully)
  });

  // Test case to simulate a successful funds transfer
  it('should transfer funds successfully', () => {
    const mockData = { fromAccount: '123', toAccount: '456', amount: 100 };  // Mock transfer data
    const mockResponse = { status: 'success' };  // Mock successful response from the service

    // Mock the transferFunds method to return the mock response
    (fundsTransferService.transferFunds as jasmine.Spy).and.returnValue(of(mockResponse)); 

    // Set the component's transferDetails property to the mock data
    component.transferDetails = mockData; 
    component.transferFunds();  // Call the transferFunds method

    // Verify that the service method was called with the correct data
    expect(fundsTransferService.transferFunds).toHaveBeenCalledWith(mockData); 
    // Optionally, check for an alert or another outcome of the transfer
  });

  // Test case to simulate an error during funds transfer
  it('should handle error during funds transfer', () => {
    const mockData = { fromAccount: '123', toAccount: '456', amount: 100 };  // Mock transfer data
    const errorMessage = 'Funds transfer failed';  // Mock error message

    // Mock the transferFunds method to return an error
    (fundsTransferService.transferFunds as jasmine.Spy).and.returnValue(throwError(() => errorMessage));

    // Set the component's transferDetails property to the mock data
    component.transferDetails = mockData;
    component.transferFunds();  // Call the transferFunds method

    // Verify that the service method was called with the correct data
    expect(fundsTransferService.transferFunds).toHaveBeenCalledWith(mockData);
    // Optionally, check if an alert or some other error-handling mechanism is invoked
  });

  // Test case to simulate invalid input and ensure an alert is shown
  it('should show alert for invalid input', () => {
    // Set invalid transfer details (empty fields and amount zero)
    component.transferDetails = { fromAccount: '', toAccount: '', amount: 0 };
    
    // Spy on the window.alert method to verify if it's called
    spyOn(window, 'alert'); 
    component.transferFunds();  // Call the transferFunds method

    // Verify that the alert method was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Please enter valid transfer details');
  });
});
