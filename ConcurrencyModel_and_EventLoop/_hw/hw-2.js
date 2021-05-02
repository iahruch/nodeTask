

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

        let v = timer.val.length > 0 ? timer.val: []
        const log = {
            name: timer.name,
            in: timer.val,
            out: timer.job(...v),
            created: new Date()
        }
        this.logs.push(log)
    }

    print() {
        console.log('All logs ', this.logs);
    }
}
const manager = new TimersManager();
const t1 = {
    name: 't1',
    delay: 500,
    interval: true,
    job: (a, b) => (a+b)
};

manager.add(t1, 1, 2);
//manager.add(t2, 1, 2);
manager.start();

setTimeout(() => {manager.pause('t1') }, 2000)
setTimeout(() => {manager.resume('t1') }, 3000)
setTimeout(() => {manager.stop() }, 5000)

setTimeout(() => {manager.print() }, 5100)
