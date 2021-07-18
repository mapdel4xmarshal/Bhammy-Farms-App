const EventEmitter = require('events');
const debugModule = require('debug');
const emitter = new EventEmitter();

class Debugger extends EventEmitter {
  static get emitter() {
    return emitter;
  }

  constructor(name) {
    super();
    name = `bhammyfarms:${name}`;
    this.name = name;
    this.debugInfo = debugModule(`${name}:info`);
    this.debugError = debugModule(`${name}:error`);
    this.debugInfo.log = console.info.bind(console);
  }

  info(name, payload) {
    this.debugInfo(name, payload);
    this.emit('info', payload);
    Debugger.emitter.emit('info', {
      name: this.name,
      payload
    });
  }

  error(name, payload) {
    this.debugError(payload);
    this.emit('err', payload);
    Debugger.emitter.emit('err', {
      name: this.name,
      payload
    });
  }
}

module.exports = Debugger;
