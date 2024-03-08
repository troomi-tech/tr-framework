interface Handler {
	[id: string]: any;
}

class TrNavigationEvents {
	handlers: Handler = {};
	lastId = Date.now();

	on(event: string, callback: any) {
		let id = ++this.lastId;
		if (!this.handlers[event]) this.handlers[event] = {};
		this.handlers[event][id] = callback;
	}

	off(id: number) {
		for (let i in this.handlers) {
			for (let j in this.handlers[i]) {
				if (parseInt(j) === id) {
					delete this.handlers[i][j];
					return;
				}
			}
		}
	}

	dispatch(event: string, data: any) {
		for (let i in this.handlers[event]) {
			if (typeof this.handlers[event][i] === 'function') this.handlers[event][i](data);
		}
	}
}

export default new TrNavigationEvents();
