

// 二、数据处理（删除表格的行与列）
// （1. 删除表格中的行数据，（对象可能会乱序）
// ws: workSheet  => 工作表
// deleteRow: 2   => 删除的行
// rowsLen: 11  => 行数
// colsLen: 9  => 列数
// (新增加A1，标题)
export const deleteExcelSheetRow = (ws,deleteRow,rowsLen,colsLen, topRows=0) =>{ 
    deleteRow = deleteRow + topRows;
    let new_ws = {}
    const aEmphaStr = 'ABCDEFGHIJKLMNOPQRST'
    let tEmphaArr = [];
    for(let i=0;i<colsLen + topRows;i++){  // (顶部标题)
        tEmphaArr.push({aEmpha:aEmphaStr[i],delEmpha:aEmphaStr[i]+deleteRow,delTurns:0,nowTurns:1 + topRows })
    }   
     
    Object.keys(ws).forEach((item,index)=>{ 

        let isStartsWith = false;
        tEmphaArr.some(subItem=>{
            if(item.startsWith(subItem.aEmpha)){
                isStartsWith = true;
                return;
            }
        })
        if(isStartsWith) { 

            // A1  A2  A3 B1 B2 B3  
            tEmphaArr.some((subItem,subIndex)=>{ 
                // [
                //    { aEmpha: 'A', delEmpha: 'A1', delTurns: 0 ,nowTurns:0},
                //    { aEmpha: 'B', delEmpha: 'B1', delTurns: 0 ,nowTurns:0}
                // ]
                if(item.startsWith(subItem.aEmpha )){ 
                    if(item != subItem.delEmpha){  
                        new_ws[subItem.aEmpha+(subItem.nowTurns-subItem.delTurns)] = ws[item]; 
                    }else{  
                        subItem.delTurns += 1 
                    }
                    subItem.nowTurns += 1 
                    
                    new_ws[subItem.aEmpha+(subItem.nowTurns-subItem.delTurns)] = ws[item];
                } 
            }) 
        }
    })  
    new_ws = {...ws,...new_ws} 
    tEmphaArr.forEach((item,index)=>{ 
        delete new_ws[(item.aEmpha)+(rowsLen+topRows)] // (顶部标题)
    })  
    return new_ws;
}
 
// （2. 删除表格中的列数据，（对象可能会乱序）
// ws: workSheet  => 工作表
// deleteCol: 2   => 删除的列
// rowsLen: 11  => 行数
// colsLen: 9  => 列数
export const deleteExcelSheetCol = (ws,deleteCol,rowsLen,colsLen, topRows=0) =>{ 
    let new_ws = {}
    const aEmphaStr = 'ABCDEFGHIJKLMNOPQRST'
    let goalEmpha = ''
    let tEmphaArr = [];
    for(let i=0;i<colsLen;i++){
        tEmphaArr.push({aEmpha:aEmphaStr[i],delEmpha:aEmphaStr[i]+deleteCol,delTurns:0,nowTurns:1 })
        if( i +1 == deleteCol){
            goalEmpha = aEmphaStr[i];
        }
    }   
    Object.keys(ws).forEach((item,index)=>{ 

        let isStartsWith = false;
        tEmphaArr.some(subItem=>{
            if(item.startsWith(subItem.aEmpha)){
                isStartsWith = true;
                return;
            }
        })
        if(isStartsWith) { 
            // A1  A2  A3 B1 B2 B3  
            tEmphaArr.some((subItem,subIndex)=>{ 
                // [
                //    { aEmpha: 'A', delEmpha: 'A1', delTurns: 0 ,nowTurns:0 },
                //    { aEmpha: 'B', delEmpha: 'B1', delTurns: 0 ,nowTurns:0 }
                // ]
                if(item.startsWith(subItem.aEmpha )){
                    var t_degit = item.match(/\d+/gi) 
                    if(subItem.aEmpha == goalEmpha ){   
                        subItem.delTurns = 1;
                    }else if(subIndex != 0 &&  tEmphaArr[subIndex - 1].delTurns == 1){
                        new_ws[tEmphaArr[subIndex - 1].aEmpha+t_degit] = ws[item];
                        subItem.delTurns = 1;
                    }else { 
                        new_ws[item] = ws[item]; 
                        subItem.delTurns = 1;
                    } 
                } 
            }) 
        }else{ 
            new_ws[item] = ws[item]; 
        }
    })  
    return new_ws;
} 
// （3.删除列表行标题
// titleList 标题列表 
// deleteRow 删除的行
export const deleteExcelSheetTitleRow = (titleList,deleteRow)=>{
    return titleList.filter((item,index)=>{
        if(index != deleteRow){
            return item;
        }
    })
} 
// （4.删除列表列标题 
// titleList 标题列表 
// deleteRow 删除的行
export const deleteExcelSheetTitleCol = (titleList,deleteCol)=>{

    return titleList.filter((item,index)=>{
        if(index != deleteCol){ 
            return item;
        }
    })
}


export default { 
    deleteExcelSheetRow,deleteExcelSheetCol,
    deleteExcelSheetTitleRow,deleteExcelSheetTitleCol,
}
