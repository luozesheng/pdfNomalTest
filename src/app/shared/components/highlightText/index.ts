/**
 * 文本高亮显示
*/
export default class HighlightText{
    $ui:any;
    constructor($ui:any){
        this.$ui = $ui;
    }
    createText(message:string){
        let text = document.createElement('span');
        let text1 = document.createElement('span');
        text.innerHTML = message
        text1.innerHTML = message
        this.$ui.appendChild(text)
        this.$ui.appendChild(text1)
    }
    paint(index:number){
        if(window.getSelection().type == 'None') return;
        // console.log(window.getSelection());
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