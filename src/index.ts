import HightlightText from './highlightText/index';
const msg = '我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家我爱我家';

window.onload = () => {
    let t = new HightlightText(document.getElementById('app'));
    t.createText(msg);
    document.getElementById('app').onmouseleave=()=>{
        try{
            t.paint(0);
        }catch(e){
            throw new Error('未选中对应的高亮文本！')
        }
        
    }
}