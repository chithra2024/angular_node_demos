import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BalanceCheckerComponent } from './balance-checker.component';

describe('BalanceCheckerComponent', () => {
  let component: BalanceCheckerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BalanceCheckerComponent],
     // declarations: [BalanceCheckerComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BalanceCheckerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.balanceForm.value).toEqual({ accountNumber: '' });
    expect(component.balanceForm.valid).toBeFalse();
  });

  it('should validate the form when filled with correct values', () => {
    component.balanceForm.setValue({ accountNumber: 101 });
    expect(component.balanceForm.valid).toBeTrue();
  });
  it('should handle null input values', () => {
    component.balanceForm.setValue({ accountNumber: null });
    component.checkBalance();
  
    expect(component.balance).toBeNull();
    expect(component.errorMessage).toBe('Account not found. Please check the account number.');
  });

  it('should find the correct balance for a valid account', () => {
    component.balanceForm.setValue({ accountNumber: 101 });
    component.checkBalance();

    expect(component.balance).toBe(5000);
    expect(component.errorMessage).toBe('');
  });

  it('should display an error message for an invalid account', () => {
    component.balanceForm.setValue({ accountNumber: 999 });
    component.checkBalance();

    expect(component.balance).toBeNull();
    expect(component.errorMessage).toBe('Account not found. Please check the account number.');
  });
});
