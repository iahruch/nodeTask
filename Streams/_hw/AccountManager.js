const { Writable } = require('stream');

class AccountManager extends Writable {
    constructor(opts = {}) {
        super(opts);
    }

    _write(chunk, encoding, done) {
        console.log('Writable stream ', chunk.payload);
        done();
    }
}
module.exports = AccountManager