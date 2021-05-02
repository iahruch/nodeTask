

class TimersManager {
    constructor() {
        this.timers = new Map();
        this.logs = [];
    }

    add(timer, ...args) {
       let isError = this.isTimerValid(timer)
        console.log(isError)
        this.timers.set(timer.name, {...timer, val: [...args]})
        return this;
    }

    remove(nameTimer) {
        this.timers.delete(nameTimer)
        this.log()
    }

    start() {
        this.timers.forEach((timer, key ) => {
            this._startTimer(timer)
        });
    }

    stop() {
        this.timers.forEach((timer, key ) => {
            this._stopTimer(timer)
        })
    }

    pause(nameTimer) {
        const timer = this.timers.get(nameTimer)
        this._stopTimer(timer)
    }

    resume(nameTimer) {
        const timer = this.timers.get(nameTimer)
      //  console.log('resume', timer)
        this._startTimer(timer)
    }

    // utils methods
    _stopTimer(timer) {
        if(timer.interval){
            clearInterval(timer.idTimer)
        }else {
            clearTimeout(timer.idTimer)
        }
        this.timers.set(timer.name, {...timer, idTimer: null })
        //console.log( this.timers)
    }
    _startTimer(timer) {
        let idTimer = null;
        if(timer.interval){
            idTimer = setInterval( this._logg.bind(this), timer.delay, timer)
        }else {
            idTimer = setTimeout( this._logg.bind(this), timer.delay, timer)
        }
        this.timers.set(timer.name, {...timer, idTimer })
    }
    isTimerValid(timer) {
        const {name, delay, interval, job} = timer

        if (typeof name === 'string' && !(name.trim().length > 0)){
            throw new Error('Name cann\'t be empty')
        }

        if (!(delay > 0 && delay <= 5000)){
            throw new Error('Delay timer must be less 5000ms')
        }
    }

    _logg(timer) {

        const logObj = {
            name: timer.name,
            in: timer.val,
            out: undefined,
            created: new Date()
        }

        try {
            let result = timer.job(...timer.val)
            logObj.out = result
        }catch (e) {
            logObj.error = {
                name: e.name,
                message: e.message,
                stack: e.trace
            }
        }
        this.logs.push(logObj)

    }

    print() {
        console.log('All logs ', this.logs);
        console.log(this.timers)

    }
}
const manager = new TimersManager();

const t1 = {
    name: 't1',
    delay: 500,
    interval: false,
    job: (a, b) => (a + b)
};
const t2 = {
    name: 't2',
    delay: 700,
    interval: false,
    job: () => {
        console.log('error');
        throw new Error('We have a problem!');
    }
};
const t3 = {
    name: 't3',
    delay: 1000,
    interval: false,
    job: n => n
};
manager.add(t1, 1, 2) // 3
manager.add(t2); // undefined
manager.add(t3, 1); // 1
manager.start();

setTimeout(() => {
    manager.print();
}, 3000);
