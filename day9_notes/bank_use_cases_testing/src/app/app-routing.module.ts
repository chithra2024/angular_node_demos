import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { FundsTransferComponent } from './funds-transfer/funds-transfer.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/account-details', pathMatch: 'full' },  // Default route
  { path: 'account-details', component: AccountDetailsComponent },  // Route for account details
  { path: 'funds-transfer', component: FundsTransferComponent },  // Route for funds transfer
  { path: 'transaction-history', component: TransactionHistoryComponent }  // Route for transaction history
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Initialize routes
  exports: [RouterModule]  // Export RouterModule for use in other components
})
export class AppRoutingModule { }
