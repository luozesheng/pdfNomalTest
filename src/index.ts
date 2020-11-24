// import HightlightText from './highlightText/index';
import Events from './Events/index';
import ZoneTest from './app/core/base/zoneState';
const msg = '123456789';

let zoneTest:ZoneTest = new ZoneTest();

window.onload = () => {
    // let events = new Events();
    // events.on( "maria", (goodName, goodPrice) => {
    //     console.log("这件商品的名称: " + goodName);
    //     console.log("这件商品的价格: " + goodPrice);
    // });
    // events.emitter("maria", "玛丽亚", 156);
    // let t = new HightlightText(document.getElementById('app'));
    // t.createText(msg);
    // document.getElementById('app').onmouseleave=()=>{
    //     try{
    //         t.paint(0);
    //     }catch(e){
    //         throw new Error('未选中对应的高亮文本！')
    //     }        
    // }
    // Zone单元测试
    zoneTest.main();
}