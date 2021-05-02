const { Transform } = require('stream');
const crypto = require('crypto');
const { promisify } = require('util')


const alg = 'aes192';
const passwordAlg = 'Password';
const scrypt = promisify(crypto.scrypt);
const randomFill = promisify(crypto.randomFill);

class Crypto extends Transform{
    constructor(opts = {}) {
        super(opts)
    }

     async _encyperData(data) {
        try {
            const key = await scrypt(passwordAlg, 'salt', 24);
            const iv = await randomFill(Buffer.alloc(16), 1);
            const cipher = crypto.createCipheriv(alg, key, iv);

            let encrypted = cipher.update(
                JSON.stringify(data),
                'utf8',
                'hex',
            );
            encrypted += cipher.final('hex');
            return encrypted
        }catch (e) {
            console.log('Error encrypt data ', e.message)
        }
    }

    async _transform(chunk, encoding, done) {
        const { name, email, password, source } = chunk
        try {
            const cyperEmail = await this._encyperData(email)
            const cyperPassword = await this._encyperData(password)
            const encryptedData = {
                source,
                payload: {
                    name,
                    email: cyperEmail ,
                    password: cyperPassword
                }
            }
            this.push(encryptedData);
        }catch (e) {
            console.log('Error', e.message)
        }
        done();
    }
}

module.exports = Crypto

