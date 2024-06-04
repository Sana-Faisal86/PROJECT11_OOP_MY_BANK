#! /usr/bin/env node 

import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";

// Start:
console.log(chalk.black.bgRedBright("\n\t\t", "+".repeat(45)));
console.log(
  "\t\t",
  chalk.black.bgBlueBright(" WELLCOME CODE TO 'OOP MY BANK'  ")
);
console.log(chalk.black.bgRedBright("\t\t", "+".repeat(45), "\n"));

// customer class
class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mobNumber: number;
  accNumber: number;

  constructor(
    fName: string,
    lName: string,
    age: number,
    gen: string,
    mob: number,
    acc: number
  ) {
    this.firstName = fName;
    this.lastName = lName;
    this.age = age;
    this.gender = gen;
    this.mobNumber = mob;
    this.accNumber = acc;
  }
}
// Interface BankAccount
interface BankAccount {
  accNumber: number;
  balance: number;
}
class Bank {
  customer: Customer[] = [];
  account: BankAccount[] = [];

  addCustomer(obj: Customer) {
    this.customer.push(obj);
  }
  addAccountNumber(obj: BankAccount) {
    this.account.push(obj);
  }
  transcation(accObj: BankAccount) {
    let NewAccounts = this.account.filter(
      (acc) => acc.accNumber !== accObj.accNumber
    );
    this.account = [...NewAccounts, accObj];
  }
}
let myBank = new Bank();

// Customer creater:
for (let i: number = 1; i <= 3; i++) {
  let fName = faker.person.firstName("male");
  let lName = faker.person.lastName();
  let num = parseInt(faker.phone.number("3#########"));
  const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
  myBank.addCustomer(cus);
  myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}
// Bank Functionality:

async function bankService(bank: Bank) {
  do {
    let service = await inquirer.prompt({
      type: "list",
      name: "select",
      message: chalk.red.bgWhite("\n\t\t>>> Please select the service ==>"),
      choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
    });

    // View Balance:
    if (service.select == "View Balance") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: chalk.red.bgWhite(
          "\n\t\t >>> Please Enter your Account Number ==>"
        ),
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.num);
      if (!account) {
        console.log(
          chalk.bold.red.underline("\n\t\t>>> Invalid Account Number <<<")
        );
      }
      if (account) {
        let name = myBank.customer.find(
          (item) => item.accNumber == account?.accNumber
        );
        console.log(
          `\n\t\t>>> Dear ${chalk.green.bold(
            name?.firstName
          )} ${chalk.green.bold(
            name?.lastName
          )} your account balance is ${chalk.bold.blue(`$${account.balance}`)}`
        );
      }
    }
    if (service.select == "Cash Withdraw") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: chalk.red.bgWhite(
          "\n\t\t>>> Please Enter your Account Number ==>"
        ),
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.num);
      if (!account) {
        console.log(
          chalk.bold.red.underline("\n\t\t>>> Invalid Account Number <<<")
        );
      }
      if (account) {
        let ans = await inquirer.prompt({
          type: "number",
          message: chalk.red.bgWhite("\n\t\t>>> Please Enter your amount ==>"),
          name: "rupee",
        });
        if (ans.rupee > account.balance) {
          console.log(chalk.red.bold("\n\t\t>>> Insufficient Balnce <<<"));
        }
        let newBalance = account.balance - ans.rupee;
        bank.transcation({ accNumber: account.accNumber, balance: newBalance });
      }
    }
    if (service.select == "Cash Deposit") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: chalk.red.bgWhite(
          "\n\t\t>>> Please Enter your Account Number ==>"
        ),
      });
      let account = myBank.account.find((acc) => acc.accNumber == res.num);
      if (!account) {
        console.log(
          chalk.bold.red.underline("\n\t\t>>> Invalid Account Number <<<")
        );
      }
      if (account) {
        let ans = await inquirer.prompt({
          type: "number",
          message: chalk.red.bgWhite("\n\t\t>>> Please Enter your amount ==>"),
          name: "rupee",
        });
        let newBalance = account.balance + ans.rupee;
        bank.transcation({
          accNumber: account.accNumber,
          balance: newBalance,
        });
      }
    }
    if (service.select == "Exit") {
      return;
    }
  } while (true);
}
bankService(myBank);
