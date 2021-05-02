const { Transform } = require('stream');
const EventEmitter = require('events');

class DB extends EventEmitter {
    constructor() {
        super();
        this.db = []
        this.initListeners()
    }

    initListeners() {
        this.on('data', data => {
            this.db.push(data)
        })

        this.on('get', () => {
            console.log('DB ', this.db)
        })
    }
}

class Logger extends Transform{
    constructor(opts = {}) {
        super(opts)
        this.db = new DB()
    }

    async _transform(chunk, encoding, done) {
       this.db.emit('data', {...chunk, data: new Date()})
       this.push(chunk);
       done();
       //this.db.emit('get')
    }
}

module.exports = Logger

