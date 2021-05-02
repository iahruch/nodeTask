const { Readable } = require('stream');

class Ui extends Readable{
    constructor(data, opts = {}) {
        super(opts);
        this.data = data
    }

    _read() {
        const data = this.data.shift();



        if (!data) {
            this.push(null);
        } else {
            data.source = { name: this.constructor.name }
            this.push(data);
        }
    }
}
module.exports = Ui