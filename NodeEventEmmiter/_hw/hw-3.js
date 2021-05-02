const EventEmitter = require('events');
const crypto = require('crypto');

class Bank extends EventEmitter{
    constructor() {
        super();
        this.persons = new Map();
        this.initListeners();
    }

    initListeners() {

        this.on('add', (personId, sum) => {
            if(!personId) {
                this.emit('error', new Error('Personal ID must be pass'))
            }

            const person = this._getPersonById(personId)
            if (!person) {
                this.emit('error', new Error('Clien not found.'))
            }

            this.persons.set(personId, {...person, balance: person.balance + +sum })
        })

        this.on('get', (personId, func) => {
            const person = this._getPersonById(personId)
            func(person.balance)
        })

        this.on('withdraw', (personId, sum) => {
            const person = this._getPersonById(personId)
            const {name, balance, limit} = person

            if ( balance < sum ) {
               this.emit('error', new Error('Not enough money'))
                return;
            }
            const currentBalance = person.balance
            const updatedBalance = person.balance - +sum
            const isValid = person.limit(sum, currentBalance, updatedBalance) //amount, currentBalance, updatedBalance
            if(!isValid) {
                this.emit('error', new Error('You cannot make a money transfer operation'))
                return;
            }
            this.persons.set(personId, {...person, balance: person.balance - +sum })

        })

        this.on('send', (personFirstId, personSecondId, sum) => {
            const firstPerson = this._getPersonById(personFirstId)
            const secondPerson = this._getPersonById(personSecondId)

            if (!firstPerson || !secondPerson) {
                this.emit('error', new Error('Client not found'))
            }

            if(firstPerson.balance < sum ) {
                this.emit('error', new Error('client doesn\'t have enough money to transfer'))
            }else {
                this.persons.set(personFirstId, {...firstPerson, balance: firstPerson.balance - +sum })
                this.persons.set(personSecondId, {...secondPerson, balance: secondPerson.balance + +sum })
            }
        })

        this.on('changeLimit', (personId, func) => {
           const person = this._getPersonById(personId)
           this.persons.set(personId, {...person, limit: func })
        })

        this.on('error', err => {
            console.log(`Error: ${err.name} - ${err.message}`)
        })


    }

    _getPersonById(personId) {
        return this.persons.get(personId)
    }
    register(data) {
        this.hash = crypto.randomBytes(5).toString('hex');
        this.persons.set(this.hash, data);
        return this.hash
    }
}

const bank = new Bank();
bank.on('error', error => {
    console.error(`Received ${error.name} with a message: '${error.message}'`);
})


const personId = bank.register({
    name: 'Oliver White',
    balance: 700,
    limit: amount => amount < 10
});


//bank.emit('add', personId, 20);
bank.emit('get', personId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});
console.log('-----------------------------------')
bank.emit('withdraw', personId, 5)

// Вариант 1
bank.emit('changeLimit', personId, (amount, currentBalance, updatedBalance) => {
    return amount < 100 && updatedBalance > 700;
});

bank.emit('withdraw', personId, 5); // Error

// Вариант 2
bank.emit('changeLimit', personId, (amount, currentBalance, updatedBalance) => {
    return amount < 100 && updatedBalance > 700 && currentBalance > 800;
});


// // Вариант 3
// bank.emit('changeLimit', personId, (amount, currentBalance) => {
//     return currentBalance > 800;
// });
// // Вариант 4
// bank.emit('changeLimit', personId, (amount, currentBalance, updatedBalance) => {
//     return updatedBalance > 900;
// });


console.log('-----------------------------------')
bank.emit('get', personId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});


