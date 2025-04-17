import { Component, OnInit } from '@angular/core';
import { FundsTransferService } from '../services/funds-transfer.service';

/**
 * @component FundsTransferComponent
 * @description This component handles the funds transfer functionality.
 * It allows users to transfer funds between accounts using a form.
 */
@Component({
  selector: 'app-funds-transfer',
  templateUrl: './funds-transfer.component.html',
  styleUrls: ['./funds-transfer.component.css']
})
export class FundsTransferComponent implements OnInit {

  /**
   * @property transferDetails
   * @description Holds the details of the funds transfer, including the 'from' account, 'to' account, and the amount.
   * @type {object}
   */
  transferDetails = {
    fromAccount: '',
    toAccount: '',
    amount: 0
  };

  /**
   * @constructor
   * @param {FundsTransferService} fundsTransferService - Injectable service for handling funds transfer logic.
   */
  constructor(private fundsTransferService: FundsTransferService) { }

  /**
   * @method ngOnInit
   * @description Lifecycle hook called after the constructor is executed.  Currently empty, but can be used for initialization logic if needed.
   * @returns {void}
   */
  ngOnInit(): void { }

  /**
   * @method transferFunds
   * @description Initiates the funds transfer process.
   * Validates the input fields before calling the FundsTransferService.
   * Displays success or error messages based on the service response.
   * @returns {void}
   */
  transferFunds() {
    // Validate input fields.
    if (!this.transferDetails.fromAccount || !this.transferDetails.toAccount || this.transferDetails.amount <= 0) {
      alert('Please enter valid transfer details');
      return;
    }

    // Call the FundsTransferService to perform the transfer.
    this.fundsTransferService.transferFunds(this.transferDetails).subscribe({
      next: () => {
        alert('Transfer Successful');
        this.resetForm(); // Reset the form after successful transfer.
      },
      error: (error) => {
        console.error("Transfer Error:", error); // Log the error to the console.
        alert(error.message || 'Transfer Failed'); // Display an error message to the user.  Prioritize error.message if available.
      }
    });
  }

  /**
   * @method resetForm
   * @description Resets the transfer details form.
   * Clears the input fields and sets the amount to 0.
   * @returns {void}
   */
  resetForm() {
    this.transferDetails = { fromAccount: '', toAccount: '', amount: 0 };
  }
}