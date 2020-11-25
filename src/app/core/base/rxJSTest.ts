
import { map, filter, scan } from "Rxjs/operators";
// const Rx = require('rxjs/Rx');
import * as Rx from 'rxjs/Rx';
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
	public main(): void {
		this.test9();	
	}
}