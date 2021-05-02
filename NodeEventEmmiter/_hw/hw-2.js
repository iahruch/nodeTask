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
            const {name, balance} = person
            if ( balance < sum ) {
               this.emit('error', new Error('Not enough money'))
            }else {
                this.persons.set(personId, {...person, balance: person.balance - +sum })
            }
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


const personFirstId = bank.register({
    name: 'Pitter Black',
    balance: 100
});
const personSecondId = bank.register({
    name: 'Oliver White',
    balance: 700
});


//bank.emit('add', personId, 20);
bank.emit('get', personFirstId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});

bank.emit('get', personSecondId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});
console.log('-----------------------------------')

bank.emit('send', personFirstId, personSecondId, 120)

bank.emit('get', personFirstId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});

bank.emit('get', personSecondId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 120₴
});


