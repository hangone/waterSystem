import { changeDataLine,changeDataLine2,changeDataFixed,reverseFormatDate,
    reverseFormatDate2,judgeListData,getObjectData,getObjectData2} from 'Utils'


// 三、水情报表数据，获取data数据 
// (1.分时时段水位报表(完成) 
export const handleHourWaterTableDataY = (types,data,maxRow=31,mmLen=10,other=[],prefix="",simbleStation="")=>{
    let tableData = []
    let data1 = data["data1:"];   // 厂房
    let data2 = data["data2:"];  // 闸室
    let data3 = data["data3:"];  // 新泉站 
  
 
    // 计算出data2的库容数据和data3的瞬时流量数据
    // let hasKurong = false;
    // let hasInterflow = true;
    // let maxKurong = 0;
    // let minKurong = 1000000000000;
    // let maxInterflow = 0;
    // let minInterflow = 1000000000000;
    // let sumKurong = data2.data.reduce((sum,item)=>{
    //     maxKurong = Math.max(maxKurong,item.w);
    //     minKurong = Math.min(minKurong,item.w);
    //     if(item.w) hasKurong = true;
    //     return sum + item.w;
    // },0)
    // data2['maxKurong'] = hasKurong ? maxKurong : null;
    // data2['minKurong'] = hasKurong ? minKurong : null;
    // data2['avgKurong'] = hasKurong ? sumKurong /(data2.data.length) : null ;
    // let sumInterflow = data3.data.reduce((sum,item)=>{
    //     maxInterflow = Math.max(maxInterflow,item.q);
    //     minInterflow = Math.min(minInterflow,item.q);
    //     if(item.q) hasInterflow = true;
    //     return sum + item.w;
    // },0)
    // data2['maxInterflow'] = hasInterflow ? maxInterflow : null;
    // data2['minInterflow'] = hasInterflow ? minInterflow : null;
    // data2['avgInterflow'] = hasInterflow ? sumInterflow /(data2.data.length) : null ;

  
    // types  
    //  water. stcd    kurong .stcd// 闸室
    //  water. stcd    inflow .stcd // 新泉站 
    //  water. stcd     // 厂房
    let turns = 0
    getObjectData2(data1,"data").forEach((item,index)=>{
        turns += 1;
        tableData.push({
            key:index+1,
            ["water"+types[0].stcd]:changeDataLine(judgeListData(data2.data,index,"rz")),
            ["kurong"+types[0].stcd]:changeDataLine(judgeListData(data2.data,index,"w")),
            ["water"+types[1].stcd]:changeDataLine(judgeListData(data3.data,index,"rz")),
            ["inflow"+types[1].stcd]:changeDataLine(judgeListData(data3.data,index,"q")),
            ["water"+types[2].stcd]:changeDataLine(judgeListData(data1.data,index,"rz")),
            ["outflow"+types[2].stcd]:changeDataLine(judgeListData(data2.data,index,"outBound")),
            ...other[turns-1] 
        }); 
    })
  
   // 最高水位
    turns += 1
    let maxwater = { 
        ["water"+types[0].stcd]:changeDataLine(data2.Max),
        ["kurong"+types[0].stcd]:changeDataLine(data2.MaxW),
        ["water"+types[1].stcd]:changeDataLine(data3.Max),
        ["inflow"+types[1].stcd]:changeDataLine(data3.MaxQ),
        ["water"+types[2].stcd]:changeDataLine(data1.Max),
        ["outflow"+types[2].stcd]:changeDataLine(data2.MaxOut),
        ...other[turns-1] 
    }
    tableData.push({key:turns,...maxwater}) 
  
   // 最高水位发生时间
   turns += 1
   let maxwaterTime = { 
       ["water"+types[0].stcd]:reverseFormatDate2(data2.MaxTime),
       ["kurong"+types[0].stcd]:reverseFormatDate2(data2.MaxWTime),
       ["water"+types[1].stcd]:reverseFormatDate2(data3.MaxTime),
       ["inflow"+types[1].stcd]:reverseFormatDate2(data3.MaxQTime),
       ["water"+types[2].stcd]:reverseFormatDate2(data1.MaxTime),
       ["outflow"+types[2].stcd]:reverseFormatDate2(data2.MaxOutTime),
       ...other[turns-1] 
   }
   tableData.push({key:turns,...maxwaterTime }) 
 
   // 最低水位
   turns += 1
   let minwater = { 
       ["water"+types[0].stcd]:changeDataLine(data2.Min),
       ["kurong"+types[0].stcd]:changeDataLine(data2.MinW),
       ["water"+types[1].stcd]:changeDataLine(data3.Min),
       ["inflow"+types[1].stcd]:changeDataLine(data3.MinQ),
       ["water"+types[2].stcd]:changeDataLine(data1.Min),
       ["outflow"+types[2].stcd]:changeDataLine(data2.MinOut),
       ...other[turns-1] 
   }
   tableData.push({key:turns,...minwater }) 
 
   // 最低水位发生时间
   turns += 1
   let minwaterTime = { 
       ["water"+types[0].stcd]:reverseFormatDate2(data2.MinTime ),
       ["kurong"+types[0].stcd]:reverseFormatDate2(data2.MinWTime),
       ["water"+types[1].stcd]:reverseFormatDate2(data3.MinTime ),
       ["inflow"+types[1].stcd]:reverseFormatDate2(data3.MinQTime ),
       ["water"+types[2].stcd]:reverseFormatDate2(data1.MinTime ),
       ["outflow"+types[2].stcd]:reverseFormatDate2(data2.MinOutTime),
       ...other[turns-1] 
   }
   tableData.push({key:turns,...minwaterTime }) 
 
   // 平均水位
   turns += 1
   let avgwater = { 
       ["water"+types[0].stcd]:changeDataLine(data2.Avg),
       ["kurong"+types[0].stcd]:changeDataLine(data2.AvgW),
       ["water"+types[1].stcd]:changeDataLine(data3.Avg),
       ["inflow"+types[1].stcd]:changeDataLine(data3.AvgQ),
       ["water"+types[2].stcd]:changeDataLine(data1.Avg),
       ["outflow"+types[2].stcd]:changeDataLine(data2.AvgOut),
       ...other[turns-1] 
   }
   tableData.push({key:turns,...avgwater }) 
 
 
    return tableData
}
// (2.分日时段水位报表(完成) 
export const handleHourFlowTableDataY = (types,data,maxRow=31,mmLen=10,other=[],prefix="",simbleStation="")=>{
    let tableData = []
    let data1 = data["data1:"];   // 厂房
    let data2 = data["data2:"];  // 闸室
    let data3 = data["data3:"];  // 新泉站 
 
    // 计算出data2的库容数据和data3的瞬时流量数据
    // let hasKurong = false;
    // let hasInterflow = true;
    // let maxKurong = 0;
    // let minKurong = 1000000000000;
    // let maxInterflow = 0;
    // let minInterflow = 1000000000000;
    // let sumKurong = data2.data.reduce((sum,item)=>{
    //     maxKurong = Math.max(maxKurong,item.w);
    //     minKurong = Math.min(minKurong,item.w);
    //     if(item.w) hasKurong = true;
    //     return sum + item.w;
    // },0)
    // data2['maxKurong'] = hasKurong ? maxKurong : null;
    // data2['minKurong'] = hasKurong ? minKurong : null;
    // data2['avgKurong'] = hasKurong ? sumKurong /(data2.data.length) : null ;
    // let sumInterflow = data3.data.reduce((sum,item)=>{
    //     maxInterflow = Math.max(maxInterflow,item.q);
    //     minInterflow = Math.min(minInterflow,item.q);
    //     if(item.q) hasInterflow = true;
    //     return sum + item.w;
    // },0)
    // data2['maxInterflow'] = hasInterflow ? maxInterflow : null;
    // data2['minInterflow'] = hasInterflow ? minInterflow : null;
    // data2['avgInterflow'] = hasInterflow ? sumInterflow /(data2.data.length) : null ;

  
    // types  
    //  water. stcd    kurong .stcd// 闸室
    //  water. stcd    inflow .stcd // 新泉站 
    //  water. stcd     // 厂房
    let turns = 0
    getObjectData2(data1,"data").forEach((item,index)=>{
        turns += 1;
        tableData.push({
            key:index+1,
            ["water"+types[0].stcd]:changeDataLine(judgeListData(data2.data,index,"rz")),
            ["kurong"+types[0].stcd]:changeDataLine(judgeListData(data2.data,index,"w")),
            ["water"+types[1].stcd]:changeDataLine(judgeListData(data3.data,index,"rz")),
            ["inflow"+types[1].stcd]:changeDataLine(judgeListData(data3.data,index,"q")),
            ["water"+types[2].stcd]:changeDataLine(judgeListData(data1.data,index,"rz")),
            ["outflow"+types[2].stcd]:changeDataLine(judgeListData(data2.data,index,"outBound")),   
            ...other[turns-1], 
        }); 
    })
  
   // 最高水位
    turns += 1
    let maxwater = { 
        ["water"+types[0].stcd]:changeDataLine(data2.Max),
        ["kurong"+types[0].stcd]:changeDataLine(data2.MaxW),
        ["water"+types[1].stcd]:changeDataLine(data3.Max),
        ["inflow"+types[1].stcd]:changeDataLine(data3.MaxQ),
        ["water"+types[2].stcd]:changeDataLine(data1.Max),
        ["outflow"+types[2].stcd]:changeDataLine(data2.MaxOut),
        ...other[turns-1], 
    }
    tableData.push({key:turns,...maxwater}) 
  
   // 最高水位发生时间
   turns += 1
   let maxwaterTime = { 
       ["water"+types[0].stcd]:reverseFormatDate(data2.MaxTime),
       ["kurong"+types[0].stcd]:reverseFormatDate(data2.MaxWTime),
       ["water"+types[1].stcd]: reverseFormatDate(data3.MaxTime) ,
       ["inflow"+types[1].stcd]:reverseFormatDate(data3.MaxQTime),
       ["water"+types[2].stcd]: reverseFormatDate(data1.MaxTime) ,
       ["outflow"+types[2].stcd]:reverseFormatDate(data2.MaxOutTime),
       ...other[turns-1], 
   }
   tableData.push({key:turns,...maxwaterTime }) 
 
   // 最低水位
   turns += 1
   let minwater = { 
       ["water"+types[0].stcd]:changeDataLine(data2.Min),
       ["kurong"+types[0].stcd]:changeDataLine(data2.MinW),
       ["water"+types[1].stcd]:changeDataLine(data3.Min),
       ["inflow"+types[1].stcd]:changeDataLine(data3.MinQ),
       ["water"+types[2].stcd]:changeDataLine(data1.Min),
       ["outflow"+types[2].stcd]:changeDataLine(data2.MinOut),
       ...other[turns-1], 
   }
   tableData.push({key:turns,...minwater }) 
 
   // 最低水位发生时间
   turns += 1
   let minwaterTime = { 
       ["water"+types[0].stcd]: reverseFormatDate(data2.MinTime),
       ["kurong"+types[0].stcd]:reverseFormatDate(data2.MinWTime),
       ["water"+types[1].stcd]: reverseFormatDate(data3.MinTime) ,
       ["inflow"+types[1].stcd]:reverseFormatDate(data3.MinQTime),
       ["water"+types[2].stcd]: reverseFormatDate(data1.MinTime) ,
       ["outflow"+types[2].stcd]:reverseFormatDate(data2.MinOutTime),
       ...other[turns-1], 
   }
   tableData.push({key:turns,...minwaterTime }) 
 
   // 平均水位
   turns += 1
   let avgwater = { 
       ["water"+types[0].stcd]:changeDataLine(data2.Avg),
       ["kurong"+types[0].stcd]:changeDataLine(data2.AvgW),
       ["water"+types[1].stcd]:changeDataLine(data3.Avg),
       ["inflow"+types[1].stcd]:changeDataLine(data3.AvgQ),
       ["water"+types[2].stcd]:changeDataLine(data1.Avg),
       ["outflow"+types[2].stcd]:changeDataLine(data2.AvgOut),
       ...other[turns-1], 
   }
   tableData.push({key:turns,...avgwater }) 
 
 
    return tableData
}
// (3.分月水位明细报表(完成) 
export const handleWhouseFlowTableDataY = (types,data,maxRow=31,mmLen=10,other=[],prefix="",simbleStation="")=>{
    let tableData = []
    let data1 = data["data1:"];   // 厂房
    let data2 = data["data2:"];  // 闸室
    let data3 = data["data3:"];  // 新泉站 
  
    // 模拟假数据, 单位出库流量(????)
    const data5 = other.map(item=>{
        return {'outflowPer':'-'};
    })

    // 模拟假数据, 单位减少库容(????)
    const data6 = other.map(item=>{
        return {'subkurongPer':'-'};
    })

    // 模拟假数据, 每日用水量(????)
    const data7 = other.map(item=>{
        return {'dayusePer':'-'};
    })

    // 模拟假数据, 单位降低水位(????)
    const data8 = other.map(item=>{
        return {'subwaterlinePer':'-'};
    })

 

    // // 计算出data2的库容数据和data3的瞬时流量数据
    // let hasKurong = false;
    // let hasInterflow = true;
    // let maxKurong = 0;
    // let minKurong = 1000000000000;
    // let maxInterflow = 0;
    // let minInterflow = 1000000000000;
    // let sumKurong = data2.data.reduce((sum,item)=>{
    //     maxKurong = Math.max(maxKurong,item.w);
    //     minKurong = Math.min(minKurong,item.w);
    //     if(item.w) hasKurong = true;
    //     return sum + item.w;
    // },0)
    // data2['maxKurong'] = hasKurong ? maxKurong : null;
    // data2['minKurong'] = hasKurong ? minKurong : null;
    // data2['avgKurong'] = hasKurong ? sumKurong /(data2.data.length) : null ;
    // let sumInterflow = data3.data.reduce((sum,item)=>{
    //     maxInterflow = Math.max(maxInterflow,item.q);
    //     minInterflow = Math.min(minInterflow,item.q);
    //     if(item.q) hasInterflow = true;
    //     return sum + item.w;
    // },0)
    // data2['maxInterflow'] = hasInterflow ? maxInterflow : null;
    // data2['minInterflow'] = hasInterflow ? minInterflow : null;
    // data2['avgInterflow'] = hasInterflow ? sumInterflow /(data2.data.length) : null ;

  
    // types  
    //  water. stcd    kurong .stcd// 闸室
    //  water. stcd    inflow .stcd // 新泉站 
    //  water. stcd     // 厂房
    let turns = 0
    getObjectData2(data1,"data").forEach((item,index)=>{
        turns += 1;
        tableData.push({
            key:index+1,
            ["water"+types[0].stcd]:changeDataLine(judgeListData(data2.data,index,"rz")),
            ["kurong"+types[0].stcd]:changeDataLine(judgeListData(data2.data,index,"w")),
            ["water"+types[1].stcd]:changeDataLine(judgeListData(data3.data,index,"rz")),
            ["inflow"+types[1].stcd]:changeDataLine(judgeListData(data3.data,index,"q")),  
            ["water"+types[2].stcd]:changeDataLine(judgeListData(data1.data,index,"rz")),
            ["outflow"+types[2].stcd]:changeDataLine(judgeListData(data2.data.index,"outBound")), 
            ...other[turns-1],  
            ...data5[turns-1],
            ...data6[turns-1],
            ...data7[turns-1],
            ...data8[turns-1]
        }); 
    })
  

   // 最高水位
    turns += 1
    let maxwater = { 
        ["water"+types[0].stcd]:changeDataLine(data2.Max),
        ["kurong"+types[0].stcd]:changeDataLine(data2.MaxW),
        ["water"+types[1].stcd]:changeDataLine(data3.Max),
        ["inflow"+types[1].stcd]:changeDataLine(data3.MaxQ),
        ["water"+types[2].stcd]:changeDataLine(data1.Max),
        ["outflow"+types[2].stcd]:changeDataLine(data2.MaxOut),
        ...other[turns-1],  
        ...data5[turns-1],
        ...data6[turns-1],
        ...data7[turns-1],
        ...data8[turns-1]
    }
    tableData.push({key:turns,...maxwater}) 
  
  // 最高水位发生时间
   turns += 1
   let maxwaterTime = { 
       ["water"+types[0].stcd]:reverseFormatDate(data2.MaxTime),
       ["kurong"+types[0].stcd]:reverseFormatDate(data2.MaxWTime),
       ["water"+types[1].stcd]: reverseFormatDate(data3.MaxTime) ,
       ["inflow"+types[1].stcd]:reverseFormatDate(data3.MaxQTime),
       ["water"+types[2].stcd]: reverseFormatDate(data1.MaxTime) ,
       ["outflow"+types[2].stcd]:reverseFormatDate(data2.MaxOutTime),
       ...other[turns-1], 
       ...data5[turns-1], 
       ...data6[turns-1],
       ...data7[turns-1],
       ...data8[turns-1]
   }
   tableData.push({key:turns,...maxwaterTime }) 
 
   // 最低水位
   turns += 1
   let minwater = { 
       ["water"+types[0].stcd]:changeDataLine(data2.Min),
       ["kurong"+types[0].stcd]:changeDataLine(data2.MinW),
       ["water"+types[1].stcd]:changeDataLine(data3.Min),
       ["inflow"+types[1].stcd]:changeDataLine(data3.MinQ),
       ["water"+types[2].stcd]:changeDataLine(data1.Min),
       ["outflow"+types[2].stcd]:changeDataLine(data2.MinOut),
       ...other[turns-1],  
       ...data5[turns-1],
       ...data6[turns-1],
       ...data7[turns-1],
       ...data8[turns-1]
   }
   tableData.push({key:turns,...minwater }) 
 
   // 最低水位发生时间
   turns += 1
   let minwaterTime = { 
       ["water"+types[0].stcd]: reverseFormatDate(data2.MinTime),
       ["kurong"+types[0].stcd]:reverseFormatDate(data2.MinWTime),
       ["water"+types[1].stcd]: reverseFormatDate(data3.MinTime) ,
       ["inflow"+types[1].stcd]:reverseFormatDate(data3.MinQTime),
       ["water"+types[2].stcd]: reverseFormatDate(data1.MinTime) ,
       ["outflow"+types[2].stcd]:reverseFormatDate(data2.MinOutTime),
       ...other[turns-1], 
       ...data5[turns-1], 
       ...data6[turns-1],
       ...data7[turns-1],
       ...data8[turns-1]
   }
   tableData.push({key:turns,...minwaterTime }) 
 
   // 平均水位
   turns += 1
   let avgwater = { 
       ["water"+types[0].stcd]:changeDataLine(data2.Avg),
       ["kurong"+types[0].stcd]:changeDataLine(data2.AvgW),
       ["water"+types[1].stcd]:changeDataLine(data3.Avg),
       ["inflow"+types[1].stcd]:changeDataLine(data3.AvgQ),
       ["water"+types[2].stcd]:changeDataLine(data1.Avg),
       ["outflow"+types[2].stcd]:changeDataLine(data2.AvgOut),
       ...other[turns-1], 
       ...data5[turns-1], 
       ...data6[turns-1],
       ...data7[turns-1],
       ...data8[turns-1]
   }
   tableData.push({key:turns,...avgwater }) 
 
 
    return tableData
}



// 四、雨情报表数据，获取data数据 
// (0.时降雨量 (完成)
export const handleHourRainTableDataY = (types,data,maxRow=30,mmLen=7,other=[],prefix="")=>{
    let tableData = []
    const { datas ,  max,  sum,   rainday, bigrainday,  rz,   w} = data; 
    // 获取第一列的信息。

    // 月份操作 
    let turns = 0;
    let afterFix = datas[0].tm.slice(mmLen); 
    // let afterFix = ':00:00'


    // 跨月操作 
    let new_other = other.slice(0,other.length - 4) 
    Array.isArray(new_other) && new_other.forEach((item,index)=>{ 
            var isExist = false;
            var af = item.month.slice(0,4) + '-' + item.month.slice(5,7) + '-' + item.month.slice(8,13) + afterFix;  
            var tObj = {key:index}
            datas.some(subItem=>{ 
                if(subItem.tm.endsWith(af)){ 
                    isExist = true;
                    tObj[subItem.stcd] = changeDataLine2(subItem.drp)
                }
            })   
            if(isExist ){
                turns += 1
                tableData.push({...tObj,...other[turns-1]})
            }
    }) 
    // for(let i=0;i<maxRow+1;i++){  //  第十二个月 
    //     var isExist = false;
    //     var af = '';
    //     if(i<10){
    //         af = `0${i}${afterFix}`
    //     }else{ 
    //         af = `${i}${afterFix}`
    //     } 
    //     var tObj = {key:i}
    //     datas.some(subItem=>{
    //         if(subItem.tm.endsWith(af)){ 
    //             isExist = true;
    //             tObj[subItem.stcd] = changeDataLine(subItem.drp)
    //         }
    //     })  
    //     if(isExist ){
    //         turns += 1
    //         tableData.push({...tObj,...other[turns-1]})
    //     }
    // }
    

    // 最大降水  
    let maxArr = {}
    let maxTimeArr = {}

    Object.keys(max).forEach(item=>{
        maxArr[item]= changeDataLine2(max[item].drp) 
        maxTimeArr[item]= max[item].tm ? max[item].tm.slice(0,13) + '时' : 0 
    }) 

    turns += 1
    tableData.push({key:turns,...maxArr,...other[turns-1]})  

    // 降水天数
    turns += 1
    tableData.push({key:turns,...rainday,...other[turns-1]}) 

    // 最大降水天数
    turns += 1
    tableData.push({key:turns,...bigrainday,...other[turns-1]})
  
   // 累计降水
   turns += 1
   tableData.push({key:turns,...sum,...other[turns-1]})

    // 发生时间
    turns += 1
    tableData.push({key:turns,...maxTimeArr,...other[turns-1]})


  
    // 新添加闸室水位列 
    // 新添加一列，给12月份，第月添加一个月平均雨量
    // 年份要新添加一年
    prefix = parseInt(prefix) - 1;
    let new_rz = Object.keys(rz).sort()
    let new_col_rz = [];
    new_rz.map(item=>{
        // if(item.startsWith(prefix) && item != undefined){
            new_col_rz.push(rz[item]);
        // }
    })  

    // 新添加闸室库容列  
    let new_w = Object.keys(w).sort()
    let new_col_w = [];
    new_w.map(item=>{
        // if(item.startsWith(prefix) && item != undefined){
            new_col_w.push(w[item]);
        // }
    })  
    tableData = tableData.map((item,index)=>{ 
        return {
            ...item,
            zsrz:changeDataLine(new_col_rz[index]),
            zsw:changeDataLine(new_col_w[index])
        }  
    })
 
    return tableData
}

// (1.日降雨量 (完成)
export const handleDayRainTableDataY = (types,data,maxRow=30,mmLen=7,other=[],prefix="")=>{
    let tableData = []
    const { datas ,  max, sum, rainday, bigrainday,  rz,   w} = data; 
    // 获取第一列的信息。

    // 月份操作 
    let turns = 0;
    let afterFix = datas[0].tm.slice(mmLen); 
    // let afterFix = ' 08:00:00'

    // 跨月操作 
    let new_other = other.slice(0,other.length - 4)
    Array.isArray(new_other) && new_other.forEach((item,index)=>{ 
            var isExist = false;
            var af = item.month.slice(0,4) + '-' + item.month.slice(5,7) + '-' + item.month.slice(8,10) + afterFix;  
            var tObj = {key:index}
            datas.some(subItem=>{ 
                if(subItem.tm.endsWith(af)){ 
                    isExist = true;
                    tObj[subItem.stcd] = changeDataLine2(subItem.drp)
                }
            })   
            if(isExist ){
                turns += 1
                tableData.push({...tObj,...other[turns-1]})
            }
    }) 
    // for(let i=0;i<maxRow+1;i++){  //  第十二个月 
    //     var isExist = false;
    //     var af = '';
    //     if(i<10){
    //         af = `0${i}${afterFix}`
    //     }else{ 
    //         af = `${i}${afterFix}`
    //     } 
    //     var tObj = {key:i}
    //     datas.some(subItem=>{
    //         if(subItem.tm.endsWith(af)){ 
    //             isExist = true;
    //             tObj[subItem.stcd] = changeDataLine(subItem.drp)
    //         }
    //     })  
    //     if(isExist ){
    //         turns += 1
    //         tableData.push({...tObj,...other[turns-1]})
    //     }
    // }
    

    // 最大降水  
    let maxArr = {}
    let maxTimeArr = {}

    Object.keys(max).forEach(item=>{
        maxArr[item]= changeDataLine2(max[item].drp) 
        maxTimeArr[item]= max[item].tm ? max[item].tm.slice(0,13) + '时' : 0 
    }) 

    turns += 1
    tableData.push({key:turns,...maxArr,...other[turns-1]})  

    // 降水天数
    turns += 1
    tableData.push({key:turns,...rainday,...other[turns-1]}) 

    // 最大降水天数
    turns += 1
    tableData.push({key:turns,...bigrainday,...other[turns-1]})
  
   // 累计降水
   turns += 1
   tableData.push({key:turns,...sum,...other[turns-1]})

    // 发生时间
    turns += 1
    tableData.push({key:turns,...maxTimeArr,...other[turns-1]})


  
    // 新添加闸室水位列 
    // 新添加一列，给12月份，第月添加一个月平均雨量
    // 年份要新添加一年
    prefix = parseInt(prefix) - 1;
    let new_rz = Object.keys(rz).sort()
    let new_col_rz = [];
    new_rz.map(item=>{
        // if(item.startsWith(prefix) && item != undefined){
            new_col_rz.push(rz[item]);
        // }
    })  

    // 新添加闸室库容列  
    let new_w = Object.keys(w).sort()
    let new_col_w = [];
    new_w.map(item=>{
        // if(item.startsWith(prefix) && item != undefined){
            new_col_w.push(w[item]);
        // }
    })  
    tableData = tableData.map((item,index)=>{ 
        return {
            ...item,
            zsrz:changeDataLine(new_col_rz[index]),
            zsw:changeDataLine(new_col_w[index])
        }  
    })


 
    return tableData
}
 
// (2.年降雨量 (完成) 
export const handleYearRainTableDataY = (types,data,maxRow=12,mmLen=7,other=[],prefix="")=>{
    let tableData = []
    const { datas ,  maxmap, rainday, bigrainday,  sum,   avgmap} = data; 
    // 获取第一列的信息。
 
    // 月份操作 
    let turns = 0;
    let afterFix = datas[0].tm.slice(mmLen);
    for(let i=0;i<maxRow+1;i++){  //  第十二个月 
        var isExist = false;
        var af = '';
        if(i<10){
            af = `0${i}${afterFix}`
        }else{ 
            af = `${i}${afterFix}`
        }
        var tObj = {key:i}
        datas.some(subItem=>{
            if(subItem.tm.endsWith(af)){ 
                isExist = true;
                tObj[subItem.stcd] = changeDataLine2(subItem.drp)
            }
        })  
        if(isExist ){
            turns += 1
            tableData.push({...tObj,...other[turns-1]})
        }
    }
    
 
    // 最大降水 
    let t_r = {}
    Object.keys(maxmap).forEach(item=>{
        t_r[item] = changeDataLine2(maxmap[item].drp);
    })
    turns += 1
    tableData.push({key:turns,...t_r,...other[turns-1]}) 
 
    // 降水天数
    turns += 1
    tableData.push({key:turns,...rainday,...other[turns-1]}) 

    // 最大降水天数
    turns += 1
    tableData.push({key:turns,...bigrainday,...other[turns-1]})
   
    
   // 累计降水
   turns += 1
   tableData.push({key:turns,...sum,...other[turns-1]})
    
    // 月平均降水
    // turns += 1
    // tableData.push({key:turns,...avgmap,...other[turns-1]})

 

    // 新添加一列，给12月份，第月添加一个月平均雨量
    // 年份要新添加一年
    prefix = parseInt(prefix) - 1;
    let new_avgmap = Object.keys(avgmap).sort()
    let new_avg = [];
    new_avgmap.map(item=>{
        if(item.startsWith(prefix) && item != undefined){
            new_avg.push(avgmap[item]);
        }
    }) 

 
    tableData = tableData.map((item,index)=>{
        if(index < 12){
            return {
                ...item,
                avgmap:new_avg[index]
            }
        }
        return item;
    })
 
 
    return tableData
}

// (3.全年逐日降雨量(完成) 
export const handleYearDayRainTableDataY = (types,data,maxRow=31,mmLen=10,other=[],prefix="",simbleStation="")=>{
    let tableData = []
    const { datas ,  max, rainday, monthsum,  yearsum } = data; 
    // 获取第一列的信息。

    // 月份操作 
    let turns = 0;
    
    // 先获取对应站点的所有数据
    let new_datas = []
    datas.map(item=>{
        if(item.stcd == simbleStation){
            new_datas.push(item);
        }
    })
    new_datas = new_datas.sort(); 
    let afterFix = datas[0].tm.slice(mmLen);
    for(let i=0;i<maxRow+1;i++){  //  第31天 

        var isExist = false;
        var af = '';
        if(i<10){
            af = `0${i}${afterFix}`
        }else{ 
            af = `${i}${afterFix}`
        }
        var tObj = {key:i}
        let monthTurns = 1;
        new_datas.some(subItem=>{
            if(subItem.tm.endsWith(af)){ 
                isExist = true; 
                monthTurns = subItem.tm ? parseInt(subItem.tm.slice(5,7)) : 1
                tObj['month'+monthTurns] = changeDataLine2(subItem.drp); 
            }
        })  
        if(isExist ){
            turns += 1
            // 判断是否满足12个月份的数据
            let tLen = Object.keys(tObj).length 
            while(tLen <= 12){ 
                monthTurns += 1;
                tObj['month'+monthTurns] = changeDataLine2(null);
                tLen += 1;
            }

            tableData.push({...tObj,...other[turns-1]})
        }
    } 
    // 月累计降水
    turns += 1
    let new_sum = []
    monthsum.forEach(item=>{
        if(item.stcd == simbleStation){
            new_sum.push(item)
        }
    }) 
    let afterF = "-01 08:00:00";
    let new_monthsum = {};
    for(let i=0;i<12;i++){ 
        var t = (parseInt(prefix) - 1) + '-' + ((i + 1)<10 ? '0'+(i + 1) : (i + 1)) + afterF;
        let isExist = false; 
        new_sum.some(item=>{
            if(item.tm == t){ 
                new_monthsum['month'+(i+1)] = changeDataLine2(item.drp)
                isExist = true;
            }
        })
        if(!isExist){ 
            new_monthsum['month'+(i+1)] = changeDataLine2(null)
        }
    }
    tableData.push({key:turns,...new_monthsum,...other[turns-1]})

    // 年累计降水
    turns += 1
    tableData.push({key:turns,month1:yearsum[simbleStation],...other[turns-1]})

    // 降水天数
    turns += 1
    tableData.push({key:turns,month1:rainday[simbleStation],...other[turns-1]}) 

    // 最大降水 
    let t_r = {}
    Object.keys(max).forEach(item=>{
        t_r[item] = changeDataLine2(max[item].drp);
    })
    turns += 1
    tableData.push({key:turns,month1:t_r[simbleStation],...other[turns-1]}) 
 
   // 发生时间（略）
    // turns += 1
    // tableData.push({key:turns,month1:'',...other[turns-1]}) 
 
 
    return tableData
}





export default {  
    handleHourFlowTableDataY,handleHourWaterTableDataY, handleWhouseFlowTableDataY,
    handleHourRainTableDataY,handleDayRainTableDataY,handleYearRainTableDataY, handleYearDayRainTableDataY 
}