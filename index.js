class Transaction{

    constructor(type,amount){
        this._type = type;
        this._amount = amount;
        this._timestamp = new Date();
    }
    get type() {
        return this._type;
    }

    get amount() {
        return this._amount;
    }

    get timestamp() {
        return this._timestamp;
    }
    toObject(){
        return {
            type: this._type,
            amount: this._amount,
            timestamp: this._timestamp
        }
    }
}
class BankAccount{

    constructor(AccountNumber,FirstName,LastName,DailyWithdrawal){
    this._AccountNumber = AccountNumber;
    this._FirstName = FirstName;
    this._LastName = LastName;
    this._AccountHolder = `${FirstName} ${LastName}`;
    this._Balance = 0;
    this._Transactions = [];
    this._DailyWithdrawal = DailyWithdrawal;
    }
    get AccountNumber(){
        return this._AccountNumber;
    }
    get Balance(){
        return this._Balance;
    }
    get AccountHolder(){
        return this._AccountHolder;
    }

   deposit(amount){
    if (amount <= 0){
        return "deposit amount must be positive";
    }
        this._Balance += amount;
        this._Transactions.push(new Transaction('deposit',amount));
    }
    getDailyWithdrawalTotal(){
       let total = 0;
       let currentDate = new Date();
      this._Transactions.forEach(transaction => {
        if(transaction.timestamp.getDate() === currentDate.getDate()) {
            total += transaction.amount;
        }
       });
    
       return total;
    }
     withdraw (amount){
        if(this.getDailyWithdrawalTotal() + amount > this._DailyWithdrawal){ 
            return "Daily withdrawal limit exceeded";
        }
        if (amount > this._Balance) {
            return "Insufficient funds";
          }
        this._Balance -= amount;
        this._Transactions.push(new Transaction('withdraw',amount));
     return "withdrawal successful";
    }
     
    transfer(amount, recipientAccount) {
        if (amount > this._Balance) {
           return "Insufficient funds";
          }
            this._Balance -= amount;
            recipientAccount.deposit(amount);
            const transaction = new Transaction("Transfer", amount);
            this._Transactions.push(transaction);
        }

        getTransactions(){
            let transactions = [];
        
            this._Transactions.forEach(transaction => {
                transactions.push(transaction.toObject());
            });
            return transactions;
            }
}


// Create a bank account 
const account1 = new BankAccount("0987654321", "Okoh", "Kingsley");
// created a second account to test the transfer feature
const account2 = new BankAccount("987654321", "kingsley", "Dennis");
// Deposit money to first account
account1.deposit(5000);
account1.withdraw(300);
// deposit money to second account
account2.deposit(2000);
account2.withdraw(300);
//transfer money from account 1 to account 2
account1.transfer(200, account2);
account2.transfer(500, account1);


// Get the transactions
const transactions = account1.getTransactions;
// testing for account 1
console.log(`Account Holder: ${account1._FirstName}, ${account1._LastName}`);
console.log(`Account Number: ${account1.AccountNumber}`);
console.log(`Balance: ${account1.Balance}`);
// testing for account 2
console.log(`Account Holder: ${account2._FirstName}, ${account2._LastName}`);
console.log(`Account Number: ${account2.AccountNumber}`);
console.log(`Balance: ${account2.Balance}`);
console.log(`Transactions:`);
for (let i = 0; i < (transactions.length); i++) {
    const transaction = transactions[i];
    console.log("Type:", transaction.type, "; Amount:", transaction.amount, "; Timestamp:", transaction.timestamp);
  }

  // test final account display
  console.log(` Account name: ${account1._FirstName}, ${account1._LastName}, Account number: ${account1.AccountNumber}, Balance: ₦${account1._Balance}`);
  console.log(`Account name ${account2._FirstName}, ${account2._LastName}, Account number: ${account2.AccountNumber}, Balance: ₦${account2._Balance}`);



 