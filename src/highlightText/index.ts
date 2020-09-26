/**
 * 文本高亮显示
*/
export default class HighlightText{
    $ui:any;
    constructor($ui:any){
        this.$ui = $ui;
    }
    createText(message:string){
        let text = document.createElement('div');
        let txt = document.createTextNode(message);
        text.appendChild(txt)
        this.$ui.appendChild(text)
    }
    paint(index:number){
        if(window.getSelection().type == 'None') return;
        const range = window.getSelection().getRangeAt(index);
        const start = { 
            node: range.startContainer, 
            offset: range.startOffset 
        }; 
        const end = { 
            node: range.endContainer, 
            offset: range.endOffset 
        }; 
        
        console.log(start, end);
    }
}