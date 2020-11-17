export default class Events{
	//发布者
	publisher: Object = {};
  recorder: Array<any> = [];
	order: Object = {};
	// 消费事件
  on(key, fn) {
    if (!this.recorder[key]) this.recorder[key] = [];
		this.recorder[key].push(fn);
	}
	// 发布事件
  emitter(...args) {
    let key = Array.prototype.shift.call(args);
		this.recorder[key].forEach((event) => {
			event.apply(this, args);
		});
	}
}

