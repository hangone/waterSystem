

// 三、实时水雨情，  传递原生的数据，获取Echarts数据,X轴
export const handleChartsDataX = (remoteObjData)=>{
    let pre_objList = Object.keys(remoteObjData).sort();
    //  判断数据是否为空
    if(!pre_objList.length)
         return []
    else    
        return pre_objList
}
  
// 传递原生的数据，获取Echarts数据,Y轴,  rain 雨量
export const handleChartsDataY = (remoteObjData,params)=>{ 
    let pre_objList = Object.keys(remoteObjData).sort();   // 需要进行排序
    //  判断数据是否为空
    if(!pre_objList.length)
         return []
    // 1.先获取当前需要处理的站点数据，生成2个对象 
    let tObj = remoteObjData[pre_objList[0]]  
    let t_seriesArr = tObj.map(item=>{ 
        return {name:item.stcd,data:[]}
    })    

    // 然后填写data数据,可能需要获取次序index
    pre_objList.forEach((item,index)=>{ 

        // remoteObjData[item]   =>    [{stcd:'你是最棒的',drp:-1},{stcd:'你也是很棒',drp:1}]
        remoteObjData[item].forEach((tItem,tIndex)=>{ 
                // tItem =>     {stcd:'你是最棒的',drp:-1}     
                // tItem =>     {stcd:'你也是很棒',drp:1}
            let tt_seriesArr = t_seriesArr.map((ttItem,ttIndex)=>{  
                if(tItem.stcd == ttItem.name){ 
                    // 向data中添加新的数据 
                    // 注意： 水量 ==》  "z"   雨量 ==》 "drp"
                    
                    return {name:ttItem.name,data:[...ttItem.data,tItem[params]]}
                    // if(params == 'z'){ 
                    //     return {name:ttItem.name,data:[...ttItem.data,tItem.z]}
                    // }
                    // else{ 
                    //     return {name:ttItem.name,data:[...ttItem.data,tItem.drp]}
                    // }
                } else{
                    return ttItem
                }
            })  
            t_seriesArr= tt_seriesArr;
        })
    })
    // t_seriesArr = handleChartsDataOrder(t_seriesArr);
    return t_seriesArr  
}
 


export default { 
    handleChartsDataX,handleChartsDataY 
}