import 'zone.js';
export default class ZoneTest{
	public name: string;
	public domString: string;
	
	baseTest(){
		let logZone = Zone.current.fork({
			name: "logZone",
			onInvoke: (
				parentZoneDelegate, 
				currentZone, 
				targetZone, 
				delegate, 
				applyThis, 
				applyArgs, 
				source) => {
				console.log(targetZone.name, "start");
				parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
				console.log(targetZone.name, 'end');
			}
		});
		logZone.run( () => {
			console.log(Zone.current.name, "queque promise");
			Promise.resolve("ok").then(v => {
				console.log(Zone.current.name, 'Promise', v)
			});
		});	
	}
	// 异步调度任务的处理
	testScheduleLog(){
		console.log("输出");
		const executeTimeZoneSpec = {
		  name: 'executeTimeZone',
		  onScheduleTask: function (parentZoneDelegate, currentZone, targetZone, task) {
		    console.time('scheduleTask')
		    return parentZoneDelegate.scheduleTask(targetZone, task);
		  },
		  onInvokeTask: function (parentzone, currentZone, targetZone, task, applyThis, applyArgs) {
		    console.time('callback')
		    parentzone.invokeTask(targetZone, task, applyThis, applyArgs);
		    console.timeEnd('callback')
		    console.timeEnd('scheduleTask')
		  }
		}

		Zone.current.fork(executeTimeZoneSpec).run(() => {
		  setTimeout(function () {
		    console.log('start callback...')
		    for (let i = 0; i < 10; i++) {
		      console.log(i)
		    }
		  }, 1000);
		});

	}
	// 执行类函数入口
	main(){
		// this.testScheduleLog()
	}
}