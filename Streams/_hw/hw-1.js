const Ui = require('./Ui')
const Crypto = require('./Crypto')
const Decrypto = require('./Decrypto')
const AccountManager = require('./AccountManager')
const Logger = require('./Logger')

const customers = [
    {
        name: 'Pitter Black',
        email: 'pblack@email.com',
        password: 'pblack_123'
    },
    {
        name: 'Oliver White',
        email: 'owhite@email.com',
        password: 'owhite_456'
    }
];

const opts_r = {
    objectMode: true
}
const ui = new Ui(customers, opts_r);

const opts_t = {
    readableObjectMode: true,
    writableObjectMode: true,
    decodeStrings: false
}
const crypto = new Crypto(opts_t);
const decrypto = new Decrypto(opts_t);
const logger = new Logger(opts_t);

const opts_w = {
    objectMode: true
}
const manager = new AccountManager(opts_w);

ui.pipe(crypto).pipe(decrypto).pipe(manager);