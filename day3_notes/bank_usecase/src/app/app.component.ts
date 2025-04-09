import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BalanceCheckerComponent } from '../Components/balance-checker/balance-checker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,BalanceCheckerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'standalone-component-Assignment1-solution';
}
