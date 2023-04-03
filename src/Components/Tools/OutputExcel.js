
// xlsx模块
import * as XLSX from 'xlsx/xlsx.mjs';  
import {MessageTool} from './MessageTool'
import {deleteExcelSheetRow,deleteExcelSheetCol,
    deleteExcelSheetTitleRow,deleteExcelSheetTitleCol} from 'Utils/tableconfig'  
import { formatDate} from 'Utils/index'  

  
// 1.导出Excel  
export const OutputExcel = (tableNodeId ,excelFileName, rowsArr , colsArr,
    deleteRow = null, deleteCol = null, rowMergesArr ={}, appendBottom={}, isDownload = true)=>{
   try{
       // (1)表单节点Id
       var table_elt = document.getElementById(tableNodeId);

       // (2)创建一个工作薄
       var workbook = XLSX.utils.table_to_book(table_elt,{display:true,origin:"A2"}); 

   
       // 一、方案一: 创建新的空工作薄，手动添加工作表和数据 
       // 1.创建一个新的工作薄
       // const workbook = XLSX.utils.book_new(); 
       // 2.添加一个新的工作表 ：数据到表中
       // var ws_name = "SheetJS";
       // /* Create worksheet */
       // var ws_data = [
       // [ "S", "h", "e", "e", "t", "J", "S" ],
       // [  1 ,  2 ,  3 ,  4 ,  5 ]
       // ];
       // var ws1 = XLSX.utils.aoa_to_sheet(ws_data); 
       // /* Add the worksheet to the workbook */
       // XLSX.utils.book_append_sheet(workbook, ws1, ws_name);
   

       // 方案二：解析table数据   
       // 1.控制解析的行 
       // （1.修改解析的行,  从开头到第n行解析
       // var workbook = XLSX.utils.table_to_book(table_elt,{sheetRows:2,display:true});
       // （2从B2开始插入
       // var workbook = XLSX.utils.table_to_book(table_elt,{display:true,origin:"B1"});  
       // 2.添加行数据： 在尾部添加一行,（修改数据）
       // XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1}); 
       // 3.计算功能（求和）
       // API function
       // XLSX.utils.sheet_set_array_formula(worksheet, "C1", "SUM(A1:A3*B1:B3)"); 
       // // ... OR raw operations
       // ws['C1'] = { t:'n', f: "SUM(A1:A3*B1:B3)", F:"C1:C1" };
       // 4.执行数据替换： 从B3开始替换,  B3    x,    [  ]   ,    以一维坐标为行数据,内部以“,”分隔作为列数据
       // XLSX.utils.sheet_add_aoa(ws, [
       //     [1],                             // <-- B3 C3 ....
       //     ,                                // <-- B4 C4 ....(不变)
       //     [/*B5*/, /*C5*/, /*D5*/, "abc"]  // <-- B5 C5 C6 C7 C8..
       //   ], { origin: "B3" });
       // 5.其它参数
       // ws['!cols']：列属性对象的数组。列宽实际上以标准化方式存储在文件中，以“最大数字宽度”（渲染数字 0-9 的最大宽度，以像素为单位）衡量。解析时，列对象存储字段中的像素宽度、wpx字段中的字符宽度以及wch字段中的最大数字宽度MDW。
       // ws['!rows']: 行属性对象数组，如文档后面所述。每个行对象都对包括行高和可见性在内的属性进行编码。
       // ws['!merges']: 对应于工作表中合并单元格的范围对象数组。纯文本格式不支持合并单元格。CSV 导出将写入合并范围内的所有单元格（如果存在），因此请确保仅设置范围内的第一个单元格（左上角）。
       // ws['!outline']：配置轮廓的行为方式。选项默认为 Print 2019 中的默认设置
       // ws [ " !margins " ] = {left:1.0 , right:1.0 , 上: 1.0 ,  bottom : 1.0 ,  header : 0.5 , footer : 0.5 } 

       //  6.将工作表设置为“正常”(没有效果)  
       // ws [ " !margins " ] = { left : 0.7 ,  right : 0.7 ,  top : 0.75 , bottom : 0.75 , header : 0.3 , footer : 0.3 } 
       /* 将工作表设置为"wide" */ 
       // ws [ " !margins " ] = {left:1.0 , right:1.0 , 上: 1.0 ,  bottom : 1.0 ,  header : 0.5 , footer : 0.5 } 
       // /* 将工作表设置为“窄” */ 
       // ws [ " !margins " ] = { left : 0.25 , right : 0.25 , top : 0.75 , bottom : 0.75 ,header:0.3 ,footer:0.3 }
       //  7.设置居中，(没有效果)
       // ws["A2"].s = {  alignment:{vertical:'center',horizontal:"center"} };//<====设置xlsx单元格样式
       // ws["B2"].s = {  alignment:{vertical:'center',horizontal:"center"} };//<====设置xlsx单元格样式
       //  8.添加标题行(没有效果)
       //  , {header:["A","B","C","D","E","F","G"], skipHeader:true} //  
             
       var ws = workbook.Sheets["Sheet1"];

       // (3).清除不必要的数据,并重新添加到工作表中
       let rowLen = rowsArr.length;//(标题栏)
       let colLen = colsArr.length; 
       if(deleteRow){ 
           ws = deleteExcelSheetRow(ws,deleteRow,rowLen,colLen, 1) // （顶部标题栏）
           rowsArr = deleteExcelSheetTitleRow(rowsArr,deleteRow)
        //    console.log("rowsArr",rowsArr,ws)
       }
       if(deleteCol){  
           ws = deleteExcelSheetCol(ws,deleteCol,rowLen-1,colLen, 1) 
           colsArr = deleteExcelSheetTitleCol(colsArr,deleteCol)
        //    console.log("colsArr",colsArr,ws)
       }
 
       
       //  (4).计算出足够的宽、高   
        let cols = [] 
        let rows = [] 
        //   (1.计算宽度
        colsArr.forEach((item,index) => {
            if(index == 0){
                cols.push({ wch: item.length  * 6 + 4 })  // （第一列）
            }else{ 
                cols.push({ wch: item.length  * 2 + 4 })  // 按照字长设置宽度
            }
        }); 
         ws["!cols"] = cols;    
         //  （2.计算高度 
         let len = rowsArr.length;
        rowsArr.forEach((item,index) => { 
            if(index == 0){
                rows.push({ hpx: 30}) 
            }else{ 
                rows.push({ hpx: 25}) 
            }
            // rows.push({ hpx: item.length  * 6 + 4 }) 
        }); 
        rows.push({ hpx: 25},{ hpx: 20})  // （打印时间）
        ws["!rows"] = rows;  


        // （5）标题栏，合并单元格，（添加标题）
        XLSX.utils.sheet_add_aoa(ws, [[excelFileName]], {origin:0}); 
        ws['!merges'] = [
            // 设置A0-A9的单元格合并
            // s起点行列，e为分隔行
            {s: {r: 0, c: 0}, e: {r: 0, c: colsArr.length-1}}
        ];
        // console.log("**********打印的长度是",colsArr.length-1,cols)


        // （6）底部栏，合并单元格（添加打印表的时间）
        const nowDate = formatDate(new Date(),'yyyy年MM月dd日'+(appendBottom ? (','+ appendBottom) : ''))
        XLSX.utils.sheet_add_aoa(ws, [["制表时间："+nowDate]], {origin:"A"+(rowsArr.length+2)});  
        ws['!merges'] = [
            // 设置A0-A9的单元格合并
            // s起点行列，e为分隔行, 以0开始 
            ...ws['!merges'] ,
            {s: {r: rowsArr.length+1, c: 0}, e: {r: rowsArr.length+1, c: colsArr.length-1}},
            ...rowMergesArr
        ];
        
        // (6)修正表格数据（行列数） 
        const aStr = 'ABCDEFGHIJKLMNOPQRST'
        deleteCol = deleteCol ? 1 : 0
        deleteRow = deleteRow ? 1 : 0
        let colTurnChar = aStr[colsArr.length - deleteCol - 1] ; //(从0 开始)
        let rowTurn = rowsArr.length - deleteRow + 2 ;  
        const newT = (ws["!fullref"] ).replace(/A1:[\w]+[\d]+/gi, `A1:${colTurnChar}${rowTurn}`)  
        ws["!fullref"] = newT
        ws["!ref"] = newT 


       // (8)下载表格 或者打印表格
       workbook.Sheets["Sheet1"] = ws;
       if(isDownload){
           XLSX.writeFile(workbook, excelFileName+".xlsx",{cellStyles: true});
       }else{ 
            printPage(ws)
       }
   }catch(err){ 
       MessageTool("导出Excel出现异常！请重试",'error')
       console.log("导出异常！",err)
   }
}

// 2.打印新页面
const printPage = (ws)=>{

        // 方法二：从导出的excel表格中打印。
        var bdHtml = XLSX.utils.sheet_to_html(ws); 
        // 方法一：原表格打印，（效果不好）
        //id为打印内容最外层节点id名称
        // var outTable = document.getElementById("outTable-div"); 
        // //获取打印内容最外层dom节点
        // let bdHtml = outTable.outerHTML;


        //打印内容赋值innerHTML绘制新页面（window.print()打印当前页)
        window.document.body.innerHTML = bdHtml;
        window.document.body.style.cssText = `
            display:flex;
            justify-content:center;
            align-items:flex-start;
            padding:70px;
            `
        let table= document.querySelector("table");
        table.style.cssText = `
            width:100vw;
            `
        let trlist = document.querySelectorAll("table tr");
        trlist.forEach((item,index)=>{   
            item.style.cssText = ` 
            min-height: 50px;`  
        })
        let tdlist = document.querySelectorAll("table tr td"); 
        let len = trlist.length;
        tdlist.forEach((item,index)=>{ 
            if(index == 0){ 
                item.style.cssText = `
                text-align:center;
                padding: 5px; 
                min-width: 60px;
                min-height:50px;
                border-collapse: collapse;
                border: 1px solid #1f1f1f;`
            }else if(index == len - 1){ 
                item.style.cssText = `
                text-align:center;
                padding: 5px; 
                min-width: 60px;
                min-height:40px;
                border-collapse: collapse;
                border: 1px solid #1f1f1f;`
            }else { 
                item.style.cssText = `
                text-align:center;
                padding: 5px; 
                min-width: 60px;
                min-height:30px;
                border-collapse: collapse;
                border: 1px solid #1f1f1f;`
            }
        })

        // if(node1) node1.style.cssText = "display:none";
        let node2 = window.document.querySelector(".func-div");
        if(node2) node2.style.cssText = "display:none";
        let node3 = window.document.querySelector(".btn-group");
        if(node3) node3.style.cssText = "display:none"; 
        let node4 =window.document.querySelector(".el-table__header-wrapper");
        if(node4) node4.style.cssText = "display:flex;justify-content:center;align-items:center";
        let node5 =window.document.querySelector(".el-table__body-wrapper")
        if(node5) node5.style.cssText = "display:flex;justify-content:center;align-items:center";

        // 去除打印机上不必要的数据
        addNewCss() 
        //调用浏览器打印机
        window.print();
        //刷新页面返回当前页
        window.location.reload();   
}

// 3.向新页面中添加样式（注解样式）
const addNewCss = ()=>{
    var styleSheets = document.styleSheets[0]; //获取样式表引用

    var index = styleSheets.length; //获取样式表中包含样式的个数

    if(styleSheets.insertRule){ //判断浏览器是否支持insertRule()方法

        //使用insertRule()方法在文档内部样式表中增加一个p标签选择符的样式，设置段落背景色为红色，字体颜色为白色，补白为一个字体大小。插入位置在样式表的末尾，

        // styleSheets.insertRule("td{background-color:red;color:#fff;padding:1em;}", index);
        styleSheets.insertRule(`
            @page {undefined
                size: auto;
                margin: 0mm;
        }`, index);
        
    }else{ //如果哦浏览器不支持insertRule()方法

        styleSheets.addRule("td", "background-color:red;color:#fff;padding:1em;", index);

    }
 
}
 