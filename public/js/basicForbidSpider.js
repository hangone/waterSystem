/* 一、文本内容反爬*/
/*1.当使用复制功能时，无法复制。*/
// window.onload = function(){
    document.oncopy = function(){
        // event.returnValue=false;
        return false;
    };
    // /*3.在选中网页元素时，会立即停止运行脚本*/
    document.onselectstart=function(){
        debugger;
    };


    /* 二、刷新页面反爬*/
    /*1.在打开开发者选项卡的情况下刷新，就会停止运行脚本*/
    (function anonymous() {
        debugger
    })();


    /* 三、鼠标或者键盘打开控制面板反爬*/
    /*1.禁止使用右键进行操作打开开发者选项*/
    document.oncontextmenu = function(){
        // event.returnValue=false;
        return false;
    };
    /*2.禁止使用F12键打开开发者选项*/
    // document.onkeydown = function(){
    //     if (window.event && window.event.keyCode === 123){
    //         // event.returnValue = false;
    //         return false;
    //     }
    // };

    /* 禁用ctrl + shift + i */
    var $msg = "请尊重劳动成果！ ";
    document.onkeydown=function(){
        var e = window.event||arguments[0];
        if(e.keyCode==123){
            //F12
            alert($msg);
            return false;
        }else if((e.ctrlKey)&&(e.shiftKey)&&(e.keyCode==73)){
            //ctrl + shift + i
            alert($msg);
            return false;
        }else if((e.ctrlKey)&&(e.keyCode==85)){
            //ctrl + U
            alert($msg);
            return false;
        }else if((e.ctrlKey)&&(e.keyCode==83)){
            //ctrl + U
            alert($msg);
            return false;
        }
    }

// };