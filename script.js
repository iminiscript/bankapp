'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

// Elements
const labelWelcome = document.querySelector('.username__label');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelTotalBankBalance = document.querySelector('.total__bank__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogOut = document.querySelector('.logout__btn');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const errorMsz = document.querySelector('.error__msz');
const loginScreen = document.querySelector('.login__screen');


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


// Functions 

const displayMovements = function (movement, sort = false) {

  containerMovements.innerHTML = '';

  const sorted = sort ? movement.slice().sort( ( a, b ) => a - b ) : movement

  sorted.forEach(function (mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__number">${i + 1}. </div>
          <div class="movements__type movements__type--${type}">
             ${type}
          </div>
          <div class="movements__date"></div>
          <div class="movements__value">${mov} €</div>
        </div>
    `
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}


const calcTotalDisplayBal = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  console.log(labelBalance);
  labelBalance.textContent = `Total Bal: ${ acc.balance} €`;
}

const calcIncomeBal = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = `${income} €`

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);

  labelSumOut.textContent = `${Math.abs(out)} €`

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * acc.interestRate / 100)
    .filter((mov) => {
      return mov >= 1
    })
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${Math.abs(interest)} €`
}

const updateUIElement = function (acc) {

  // Display Current USER
  displayMovements(acc.movements);
  // Current Total Balance
  calcTotalDisplayBal(acc);
  // USER Account summry
  calcIncomeBal(acc);

  console.log(acc)
  
}

const createUserName = function (accs) {
  let user;
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((username) => username[0])
      .join('');
    console.log(acc.username)
  })
}

createUserName(accounts);

const startTimerLogin = function() {
  let time = 120;

  const timer = setInterval(() => {
      const mint = String(Math.trunc(time / 60)).padStart(2, 0);
      const secd = String(time % 60).padStart(2, 0);

      labelTimer.textContent = `${mint}:${secd}`;

      if (time === 0) {
        containerApp.classList.add('hide');
        loginScreen.classList.remove('hide');
        clearInterval(timer);
      }

      time--;

  }, 1000);
}


// Event Handler 

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.classList.remove('hide');

    // clear input data 
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    errorMsz.classList.remove('visible');
    loginScreen.classList.add('hide');

    // Show Current Date
    const today = new Date();
    labelDate.textContent = today.toLocaleDateString("en-US", dateOptions);
    startTimerLogin();
    updateUIElement(currentAccount);

  } else {
    errorMsz.classList.add('visible');
    errorMsz.textContent = `The User Name or Password doesn't Match with DataBase`
    containerApp.classList.add('hide');
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  console.log(currentAccount.balance)

  if (amount > 0 &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= currentAccount.balance
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount)

    updateUIElement(currentAccount);
  } else {
    errorMsz.textContent = `Something is wronge Please check username and amount again`;
    errorMsz.classList.add('visible');
    setTimeout(() => {
      errorMsz.classList.remove('visible');
      inputTransferAmount.value = '';
      inputTransferTo.value = '';

    }, 3000);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(btnLoan)

  const loanAmount = Math.floor(inputLoanAmount.value)

  if (loanAmount > 0 && movements.some(mov => mov >= loanAmount * 0.1)) {
    currentAccount.movements.push(loanAmount);
    updateUIElement(currentAccount);
    inputLoanAmount.value = '';
  } else {
    errorMsz.textContent = `You're Not Eligble for ${loanAmount} EUR Amount of Loan, Please contact the Branch`;
    errorMsz.classList.add('visible');

    setTimeout(() => {
      errorMsz.classList.remove('visible');
    }, 3000);
  }
})


btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(btnClose)

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username)
    console.log(index)
    accounts.splice(index, 1);

    containerApp.style.opacity = '0';
    // clear input data 
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    inputLoginUsername.focus();
    errorMsz.classList.remove('visible');

  } else {
    errorMsz.classList.add('visible');
    errorMsz.textContent = `Typed USERNAME "${inputCloseUsername.value }" or PIN is not correct`
    setTimeout(() => {
      errorMsz.classList.remove('visible');
      inputCloseUsername.value = '';
      inputClosePin.value = '';
      inputLoginUsername.focus();
    }, 3000);
  }
});
let sorted = false
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements , !sorted);
  sorted = !sorted;
  sorted ?  btnSort.classList.add('sorting') : btnSort.classList.remove('sorting');

});

btnLogOut.addEventListener('click', function(e) {
  e.preventDefault();
  loginScreen.classList.remove('hide');
  containerApp.classList.add('hide');
})

