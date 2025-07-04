import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Myservice, Transaction } from '../myservice';
import { RouterOutlet,Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule,RouterOutlet],
  providers: [Myservice],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  userlist: any;

  constructor(private myservice: Myservice, private router: Router) { }

  activeForm: string = 'dashboard';
  userPhoneNumber: any;


  currentBalance: string = " ";

  transactions: Transaction[] = [];

  toastMessage: string = '';
  toastType: string = '';

  lastUpdatedTime: Date | null = null;


  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = '';
    }, 3000); // auto hide after 3 seconds
  }


  ngOnInit(): void {
    this.userPhoneNumber = sessionStorage.getItem("number");
    this.Balance();
    this.loadTransactions();

    this.myservice.transactionUpdated.subscribe(() => {
      this.loadTransactions();
      this.Balance();
    })
  }

  Balance() {
    this.myservice.balance(this.userPhoneNumber).subscribe(
      data => {
        this.currentBalance = data.result.amount;
      });
    this.updateLastUpdateTime();
  }

  loadTransactions() {
    this.myservice.getTransactions(this.userPhoneNumber).subscribe(data => {
      this.transactions = data.result;
    });
    this.updateLastUpdateTime();

  }

  showDashboard() {
    this.activeForm = 'dashboard';
  }


  showAddMoney() {
    this.router.navigate(['/add-money'])
  }

  showSendMoney() {
    this.router.navigate(['/payment'])
  }

  updateLastUpdateTime() {
    this.lastUpdatedTime = new Date();
  }

  delbyid(tid: number) {
    this.myservice.DeleteTransactionById(tid).subscribe(data => {
      this.showToast("Transaction deleted Successfully!", 'success');
      this.loadTransactions();
    }, err => {
      this.showToast('Failed to delete transaction.', 'error')
    });
  }

  deltran() {
    this.myservice.DeleteTransaction(this.userPhoneNumber).subscribe(data => {
      this.showToast("Transaction deleted Successfully!", 'success');
      this.loadTransactions();
    }, err => {
      this.showToast('Failed to delete transaction.', 'error')
    })

  }



}