import EventEmitter from "event-emitter";

class Handler {
	constructor(chunker, caller) {
		let hooks = Object.assign({}, chunker && chunker.hooks, caller && caller.hooks);
		this.chunker = chunker;
		this.caller = caller;

		for (let name in hooks) {
			if (name in this) {
				let hook = hooks[name];
				hook.register(this[name].bind(this));
			}
		}
	}
}

EventEmitter(Handler.prototype);

export default Handler;
