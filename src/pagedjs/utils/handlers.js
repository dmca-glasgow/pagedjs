import Breaks from "../modules/breaks.js";
import StringSets from "../modules/string-sets.js";
import EventEmitter from "event-emitter";
import pipe from "event-emitter/pipe.js";

export let registeredHandlers = [Breaks, StringSets];

export class Handlers {
	constructor(chunker, caller) {
		let handlers = [];

		registeredHandlers.forEach((Handler) => {
			let handler = new Handler(chunker, caller);
			handlers.push(handler);
			pipe(handler, this);
		});
	}
}

EventEmitter(Handlers.prototype);

export function registerHandlers() {
	for (var i = 0; i < arguments.length; i++) {
		registeredHandlers.push(arguments[i]);
	}
}

export function initializeHandlers(chunker, caller) {
	let handlers = new Handlers(chunker, caller);
	return handlers;
}
