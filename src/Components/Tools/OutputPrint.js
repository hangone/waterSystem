 
 import { OutputExcel } from "./OutputExcel"

// 导出Excel  
export const OutputPrint = (tableNodeId ,excelFileName, rowsArr , colsArr,
     deleteRow = null, deleteCol = null, rowMergesArr ={}, appendBottom={} )=>{
    // 先转换成Excel，再输出Excel表格打印
        OutputExcel(tableNodeId ,excelFileName, rowsArr , colsArr, deleteRow , deleteCol , rowMergesArr ,appendBottom, false)
}
