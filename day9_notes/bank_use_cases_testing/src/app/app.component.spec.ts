import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar'; // Import the necessary material module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Angular Material
import { RouterTestingModule } from '@angular/router/testing'; // To test router links
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        MatToolbarModule, // Add Angular Material toolbar module
        RouterTestingModule, // Add RouterTestingModule to simulate router behavior
        BrowserAnimationsModule, // Needed for Angular Material
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the title 'My Angular App'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('My Angular App'); // Match the actual value of the title
  });

  it('should render the title in the toolbar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Check for the title text inside the mat-toolbar
    expect(compiled.querySelector('mat-toolbar span')?.textContent).toContain('Banking Application');
  });

  it('should have router links to navigate', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check if the buttons are present and have correct routerLink
    const accountDetailsButton = compiled.querySelector('button[routerLink="/account-details"]');
    expect(accountDetailsButton).toBeTruthy();
    
    const fundsTransferButton = compiled.querySelector('button[routerLink="/funds-transfer"]');
    expect(fundsTransferButton).toBeTruthy();
    
    const transactionHistoryButton = compiled.querySelector('button[routerLink="/transaction-history"]');
    expect(transactionHistoryButton).toBeTruthy();
  });
});