import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FundsTransferComponent } from './funds-transfer/funds-transfer.component';
import { AccountService } from './services/account.service'; // Import services
import { FundsTransferService } from './services/funds-transfer.service';
import { TransactionService } from './services/transaction.service';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
@NgModule({
  declarations: [
    AppComponent,
    AccountDetailsComponent,
    FundsTransferComponent,
    TransactionHistoryComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [  // Register the services here (though it's not required if providedIn: 'root')
    AccountService,
    FundsTransferService,
    TransactionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

