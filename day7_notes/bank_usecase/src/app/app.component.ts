import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountComponent } from "./components/account/account.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AccountComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'Account Management Application';
}
