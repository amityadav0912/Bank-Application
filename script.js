 'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Amit Yadav',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Pratham Mittal',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Aayush Soni',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Shubham Pansari',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const displayMovements = function(movements,sort=false)
{    
     containerMovements.innerHTML='';

     const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;
     movs.forEach(function(mov,i)
     { 
       const type = mov>0 ? 'deposit' : 'withdrawal';
       const html =`
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i+1} 
          ${type}
          </div>
          <div class="movements__value">${mov}€</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin',html);
     })
}
//displayMovements(account1.movements);

const calcPrintBalance = function(acc)
{
  acc.balance = acc.movements.reduce((acc,cur) => acc+cur,0);
  labelBalance.textContent=`${acc.balance}€`;
}


const calcDisplaySummary  = function(acc)
{ 
  const incomes = acc.movements.filter(mov => mov>0)
  .reduce((acc,cur) => acc+cur,0);
  labelSumIn.textContent=`${incomes}€`

  const outcomes = acc.movements.filter(mov => mov<0)
  .reduce((acc,cur) => acc+cur,0);
  labelSumOut.textContent=`${Math.abs(outcomes)}€`

  const interest = acc.movements.filter(mov => mov>0)
  .map(deposit => (deposit*acc.interestRate)/100)
  .filter(int => int>=1)
  .reduce((acc,cur) => acc+ cur,0);
  labelSumInterest.textContent=`${interest}€`;
}
//calcDisplaySummary(account1.movements);

const createUserNames = function(accs)
{
accs.forEach(function(acc)
{
   acc.username = acc.owner
  .toLowerCase()
  .split(' ')
  .map(name => name[0])
  .join('');
})
}
//console.log(createUserNames('Sarah Smith'));
createUserNames(accounts);

const updateUI = function(acc)
{
  // display moments 
  displayMovements(acc.movements);
  // display balance 
  calcPrintBalance(acc);
  // displaay summ
  calcDisplaySummary(acc);
}
let currentAccount;
btnLogin.addEventListener('click',function(e)
{ 
  e.preventDefault(); // prevent form from submiting
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  if(currentAccount?.pin===Number(inputLoginPin.value))
  {
    // Display ui and message 
    labelWelcome.textContent=`Welcome Back,${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity=100;
    // clear input 
    inputLoginUsername.value=inputLoginPin.value='';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
})

btnTransfer.addEventListener('click',function(e)
{
  e.preventDefault();
  const amount=Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc=> acc.username===inputTransferTo.value);
  inputTransferAmount.value=inputTransferTo.value='';

  if(amount>0 && receiverAcc && currentAccount.balance>=amount && receiverAcc?.username !== currentAccount.username)
  {
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        updateUI(currentAccount);
  }
  
});

btnLoan.addEventListener('click',function(e)
{
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(mov =>
    mov>= amount*0.1))
    {
      // add movement 
      currentAccount.movements.push(amount);
      
      // update ui
      updateUI(currentAccount);

    }
    inputLoanAmount.value='';
})

btnClose.addEventListener('click',function(e)
{
  e.preventDefault();
  if(inputCloseUsername.value===currentAccount.username
     && Number(inputClosePin.value)===currentAccount.pin)
{
  const index = accounts.findIndex(
    acc=> acc.username===currentAccount.username);

    // delete account
    accounts.splice(index,1);

    //hide ui
    containerApp.style.opacity=0;
  }  
  inputCloseUsername.value=inputClosePin.value='';
})
let sorted = false;
btnSort.addEventListener('click',function(e)
{
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted=!sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Slice arr remain same
// let arr = [ 'a' , 'b' , 'c' , 'd' , 'e'];
// console.log(arr.slice(2));
// console.log(arr);
// console.log(arr.slice(2,4));
// console.log(arr.slice(-1));
// console.log(arr.slice(1,-2));

// splice mutate the arr 

// console.log(arr.splice(2));
// arr.splice(-1);
// arr.splice(1,2);
// (start index , no of elements to delete)
// console.log(arr);


// // reverse mutate the arr
// console.log(arr.reverse());
// console.log(arr);


// // concat 

// const letters = arr.concat(arr);
// console.log(letters);

// // join 

// console.log(letters.join('-'));


//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements)
// for(const [i,movement ] of movements.entries())
// { 
//   if(movement>0)
//   {
//   console.log(`Movement ${i+1} : You deposited ${movement}`);
//   }
//   else{
//   console.log(`Movement ${i+1} : You Withdrew ${Math.abs(movement)}`);
//   }
// }

// movements.forEach(function(movement , i , arr){
//   if(movement>0)
//   {
//   console.log(`Movement ${i+1} : You deposited ${movement}`);
//   }
//   else{
//   console.log(`Movement ${i+1} : You Withdrew ${Math.abs(movement)}`);
//   }
// });


// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
//   ]);


//   currencies.forEach(function(value ,key ,map)
//   {
//     console.log(`${key} : ${value}`);
//   });



// Challenge 1 

// const checkDogs = function(dogsJulia,dogsKate)
// {
//      const dogsJuliaCorrected = dogsJulia.slice();
//      dogsJuliaCorrected.splice(0,1);
//      dogsJuliaCorrected.splice(-2);
//      const dogs = dogsJuliaCorrected.concat(dogsKate);
//      dogs.forEach(function (element,i ){
//        if(element>=3)
//        {
//        console.log(`Dog number ${i+1} is and adult, and is ${element} year old`);
//        }
//        else{
//        console.log(`Dog number ${i+1} is still a puppy, and is ${element} year old`);
//        }
     
//       });
// }
// checkDogs([3,5,2,12,7],[4,1,15,8,3]);


// Challenge 2 

// const calcAverageHumanAge = function(ages)
// {
//   const humanYears = ages.map(age => age<=2 ? 2*age : 16+age*4);
//   const adult = humanYears.filter(age => age>=18);
//   console.log(humanYears);
//   console.log(adult);
//   const average = adult.reduce((acc,age) => acc+age ,0)/adult.length;
//   return average;
// };
// console.log(calcAverageHumanAge([5,2,4,1,15,8,3]));

// const calcAverageHumanAge = ages =>
//    ages.map(age => age<=2 ? 2*age : 16+age*4)
//   .filter(age => age>=18)
//   .reduce((acc,age,i,arr) => acc+age/arr.length ,0)
// ;

// console.log(calcAverageHumanAge([5,2,4,1,15,8,3]));


// Challenge 4

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// dogs.forEach(dog => (dog.recFood = dog.weight ** 0.75 *28));
// console.log(dogs);

// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);

















// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1;
// const movementsUSD = movements.map(function(mov)
// {
//   return mov*euroToUsd;
// });
// const movementsUSD = movements.map(mov => mov*euroToUsd);
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for(const mov of movements) movementsUSDfor.push(mov*euroToUsd);
// console.log(movementsUSDfor);

// const movementsDes = movements.map((movement,i,arr) => 
//  `Movement ${i+1} : You ${movement>0 ? 'deposited' : 'Withdrew'} ${Math.abs(movement)}`
  // if(movement>0)
  // {
  // return `Movement ${i+1} : You deposited ${movement}`;
  // }
  // else{
  // return `Movement ${i+1} : You Withdrew ${Math.abs(movement)}`;
  // }
// );
// console.log(movementsDes);


// const deposits = movements.filter(mov => mov>0);
// console.log(deposits);

// const deposits = movements.filter(mov => mov>0);
// console.log(deposits); // t t f t f f t t 


// console.log(movements);
// // accumulatr is snawball 
// const balance = movements.reduce(function(acc,cur,i,arr)
// {  
//   console.log(`Iteration ${i} ${acc}`);
//    return acc + cur;
// },0)
// console.log(balance);


// Maximum value 

// const maximum = movements.reduce((acc,cur) => acc > cur ? acc : cur,movements[0]);
// console.log(maximum);


// const totalDepositsUSD = movements.filter(mov => mov>0)
// .map(mov=> mov*euroToUsd)
// .reduce((acc,mov) => acc+mov,0);
// console.log(totalDepositsUSD);

// const firstWithdrawal = movements.find(mov => mov<0)
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);
// const account = accounts.find(acc => acc.owner==='Jessica Davis');
// cons

// equality
// console.log(movements.includes(-130));
// // some method condition 
// const anyDeposits = movements.some(mov => mov>0)
// console.log(anyDeposits);

// every

// console.log(movements.every(mov=> mov>0));

// // seprate call back
// const positive = mov=> mov>0 
// console.log(movements.every(deposit));

// const arr  = [[1,2,3],[4,5,6],7,8];
// console.log(arr.flat());
// const arrDeep =[9,[[1,2,3],[4,5,6],7,8]];
// console.log(arrDeep.flat(2));

// const overAllMovements = accounts.map(acc=> acc.movements).flat().reduce((acc,mov) => acc+mov,0);
// console.log(overAllMovements);

// Strings
// const owners = ['jonas','zach','Adam','madam'];
// console.log(owners.sort());
// console.log(owners);

// // NUmbers
// console.log(movements);
// // console.log(movements.sort());

// // return < 0 a,b
// // return >0 b,a
// // movements.sort((a,b)=>{
// //   if(a>b) return 1;
// //   if(b>a) return -1;
// // })
// movements.sort((a,b)=>a-b)
// // reverse in descending 
// console.log(movements);


// const bankDepositSum = accounts
// .map(acc=> acc.movements)
// .flat()
// .filter(mov=> mov>0)
// .reduce((mov,cur) => mov+cur,0);

