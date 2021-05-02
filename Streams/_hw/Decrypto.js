const { Transform } = require('stream');
const crypto = require('crypto');
const { promisify } = require('util')

const alg = 'aes192';
const passwordAlg = 'Password';
const scrypt = promisify(crypto.scrypt);
const randomFill = promisify(crypto.randomFill);

class Decrypto extends Transform{
    constructor(opts = {}) {
        super(opts)
    }

     async _decypherData(data) {
        try {
            const key = await scrypt(passwordAlg, 'salt', 24);
            const iv = await randomFill(Buffer.alloc(16), 1);

            const decipher = crypto.createDecipheriv(alg, key, iv);

            let decrypted = decipher.update(
                data,
                'hex',
                'utf8'
            );
            decrypted += decipher.final('utf8');
            return decrypted
        }catch (e) {
            console.log('Error ********** ', e.message)
        }
    }

    async _transform(chunk, encoding, done) {
        const {payload: {name, email, password}, source } = chunk

        console.log({name, email, password, source})
        try {
            const decypherEmail = await this._decypherData(email)
            const decypherPassword = await this._decypherData(password)

            const decypherData = {
                source,
                payload: {
                    name,
                    email: decypherEmail ,
                    password: decypherPassword
                }
            }
            this.push(decypherData);
        }catch (e) {
            console.log('Error decypher: ', e.message)
        }
        done();
    }
}

module.exports = Decrypto

