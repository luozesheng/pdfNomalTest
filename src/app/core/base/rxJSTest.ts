
import {
	map,
	filter,
	scan,
	switchMap,
	shareReplay,
	tap,
	pluck,
	take,
	mergeMap
} from "rxjs/operators";
import { interval } from 'rxjs/observable/interval';
// const Rx = require('rxjs/Rx');
import * as Rx from 'rxjs/Rx';
import { createPublicKey } from "crypto";
export default class RxUnitTest {
	public testArray: Array<number> = [];
	private domString: string;
	private subscribe: any;
	constructor() {
		this.domString = `<div id="RxID" style="width:100px;height:100px;background-color:#e2e2e2;">
			观察者
		</div>`;
		document.getElementById("app").innerHTML = this.domString;
	}
	test1() {
		// console.log("RxJS test");
		// let observer = {
		// 	next(value) { 
		// 		console.log(`收到${value}`);
		// 	}
		// };
		// let Observable = (obj) => { 
		// 	setTimeout(() => { 
		// 		obj.next("1000美元");
		// 	}, 100);
		// }
		// Observable(observer);
	}
	test2() {
		/**
		 * 单元宏任务优先执行，若存在微任务，等待微任务全部执行完毕，执行宏任务
		 * */
		let observable = Rx.Observable.create((observer) => {
			try {
				let p1 = new Promise((resolve, reject) => {
					observer.next(1);
					resolve(1);
				});
				let p2 = new Promise((resolve, reject) => {
					observer.next(2);
					resolve(1);
				});
				let p3 = new Promise((resolve, reject) => {
					observer.next(3);
					resolve(1);
				});
			} catch (err) {
				observer.error(err);//捕获异常
			}
			// observer.next(2);
			// observer.next(3);
			setTimeout(() => { //遇到异步任务
				observer.next(4);
				observer.complete();
				observer.next(5);//数据流已经结束，不执行当前代码块
			}, 0);
		});
		console.log("just start suscribe!")
		let subscribe = observable.subscribe({
			next: x => {
				console.log(`get value ${x}`, subscribe)
				// if(x == 2) subscribe.unsubscribe();
				
			},
			error: err => console.error(`something is wrong with ${err}`),
			complete: _ => console.log("DONE")
		})
		// subscribe.subscribe();//清空task内存，终止task
		console.log("just after suscribe!")
	}
	/**
	 * pipe使用
	 * */
	test3() {
		let source = Rx.Observable.range(0, 10);
		// let subscribe = source.pipe(
		// 	filter(x => x % 2 === 0),
		// 	map(x => x + x),
		// 	scan((acc, x) => acc + x, 0)
		// ).subscribe(x => x)
		source.pipe(
			map(x => x)
		).subscribe(
			x => console.log(x)
		);
		// console.log(subscribe.remove)
	}
	/**
	 * scheduler使用
	 * */
	test4() {
		let observable = Rx.Observable.create((o) => {
			o.next(1);
			o.next(2);
			o.next(3);
			o.complete();
		}).observeOn(Rx.Scheduler.async);
		let finalObserver = {
			next: x => console.log(x),
			error: err => console.log(err),
			complete: _ => console.log("DONE")
		};
		console.log("start");
		observable.subscribe(finalObserver);
		console.log("END");
	}
	/**
	 * test5,test6关于多个subject和多个observables的实例
	 * observable或者observer多对一，一对多时，她的每个任务都是同步执行，
	 * */
	test5() {
		let subject = new Rx.Subject();
		subject.subscribe({
			next: x => console.log("subject A: ", x)
		});
		subject.subscribe({
			next: x => console.log("subject B: ", x)
		});
		let observable = Rx.Observable.from([1, 2, 3]);
		let tt = setTimeout(() => {
			observable.subscribe(subject);//执行source.subscribe();//最终执行者	
		}, 5000);
		
	}
	test6() { 
		let source = Rx.Observable.from([1, 4, 6]);
		let subject = new Rx.Subject();
		let multicasted = source.multicast(subject);//Observable绑定subject
		multicasted.subscribe({
			next: x => console.log(`the role is ${x}`)
		});
		multicasted.subscribe({
			next: x => console.log(`the role is ${x}`)
		});
		let tt = setTimeout(() => {
			multicasted.connect();//执行source.subscribe();//最终执行者	
		}, 5000);
		
	}
	test7() { 
		let source = Rx.Observable.interval(500);
		let subject = new Rx.Subject();
		let s1, s2, sct;
		let muticase = source.multicast(subject);
		s1 = muticase.subscribe({
			next: x=> console.log("subject 1: " + x)
		});
		sct = muticase.connect();
		setTimeout(() => { 
			s2 = muticase.subscribe({
				next: x=> console.log("subject 2: " + x)
			});
		}, 1000);
		setTimeout(() => { 
			s1.unsubscribe();
			s2.unsubscribe();
			// sct.unsubscribe();
		}, 2000)
	}
	test8() { 
		let source = Rx.Observable.interval(100);
		let subject = new Rx.Subject();
		let refCount = source.multicast(subject).refCount();
		let sub1, sub2, subcnt;
		sub1 = refCount.subscribe({
			next: x=>console.log('subject1: '+ x)
		});
		setTimeout(() => { 
			sub2 = refCount.subscribe({
				next: x=>console.log('subject2: '+ x)
			})
		}, 100);
		setTimeout(() => { 
			sub1.unsubscribe();
		}, 200);
		setTimeout(() => { 
			sub2.unsubscribe();
		}, 200);
	}
	/**
	 * BehaviorSubject
	 * subject的子集
	 * 同理，意味着创建的subscribtion有一个共同的父级
	*/
	test9() { 
		let bhs = new Rx.BehaviorSubject(0);
		bhs.subscribe({
			next: x => console.log('序列号:' + x)
		});
		bhs.next(1);
		bhs.next(100);
		bhs.subscribe({
			next: x => console.log("序列2： ", x)
		})
		bhs.next(200)
	}
	test10() { 
		let source = Rx.Observable.timer(0, 3000);
		// source.subscribe(x => console.log('subscribe A: ', x));
		// source.subscribe(x => console.log('subscribe B: ', x));
	}
	/**
	 * 多个选项卡间切换时，使用switchMap可以取消订阅，订阅最新的subscription
	 * 避免多个subscription并发请求，消耗多余的资源
	 * */ 
	test11() { 
		let domstr = `<div style="display:flex;flex:1;justify-content:space-between;">
			<div class="tabs" style="width:60px;height:30px;background-color:rgba(151,151,151,0.6);">选项卡1</div>
			<div class="tabs" style="width:60px;height:30px;background-color:rgba(151,151,151,0.6);">选项卡2</div>
			<div class="tabs" style="width:60px;height:30px;background-color:rgba(151,151,151,0.6);">选项卡3</div>
		</div>`;
		document.getElementById("app").innerHTML = domstr;
		let tabs = document.getElementsByClassName("tabs");
		let clicks = Rx.Observable.fromEvent(tabs, "click");
		let source = clicks.switchMap((event) => Rx.Observable.interval(1000));
		source.subscribe(x => console.log(x));
	}
	test12() { 
		let data = [{
			username: {
				name: "maria"
			},
			address: "福州市闽侯县荆溪镇古山洲"
		},{
			username: {
				name: "lisa"
			},
			address: "福州市鼓楼区软件园F区"
			}];
		let source = Rx.Observable.from(data).pluck("username", "name");
		source.subscribe({
			next: x => console.log(x)
		});
	}
	/**
	 * test13,test14都是对shareReply,replySubject实例描述
	 * 
	 * */ 
	test13() { 
		const routed = new Rx.Subject<{ data: any, url: string }>();
		let lastUrl = routed.pipe(
			tap(_ => console.log("begin")),
			pluck('url'),
			shareReplay() //所有的subscription都能共享数据
		);
		// 其实订阅者必须
		lastUrl.subscribe(console.log);
		routed.next({ data: { name: "maria" }, url: "www.baidu.com" });
		lastUrl.subscribe(console.log);
	}
	test14() { 
		const subject = new Rx.Subject<{ data: any, url: string }>();
		const shareWidthReplay = new Rx.ReplaySubject();
		let last = subject.pipe(
			pluck("url")
		);
		last.subscribe(x => shareWidthReplay.next(x));
		shareWidthReplay.subscribe(console.log);
		subject.next({
			data: {
				name:"maria"
			},
			url: "www.baidu.com/cn"
		});
		subject.next({
			data: {
				name:"lisa"
			},
			url: "11111111111111111"
		});

	}
	test15() { 
		// let str = `<input type="text" id="inputID" />`;
		// document.getElementById("app").innerHTML = str;
		// let id = document.getElementById("inputID");
		// let change = Rx.Observable.fromEvent(id, "change");
		// let source = change.switchMap((event) => { 
		// 	console.log(event.target)
		// 	return Rx.Observable.interval(2000);
		// });
		// source.subscribe();
		// var clicks = Rx.Observable.fromEvent(document, 'click');
		// var tagNames = clicks.pluck('target', 'style');
		// tagNames.subscribe(x => console.log(x));
	}
	test16() { 
		let data = [{
			username: {
				name: "maria"
			},
			address: "福州市闽侯县荆溪镇古山洲"
		},{
			username: {
				name: "lisa"
			},
			address: "福州市鼓楼区软件园F区"
			}];
		let source = Rx.Observable.from(data);
		let last = source.pipe(
			take(1),
			mergeMap(_=> data)
		);
		last.subscribe(console.log);
	}
	public main(): void {
		this.test16();	
	}
}