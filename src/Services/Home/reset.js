import { request } from "Services/request";
import qs from 'querystring'; 
// 处理params函数
const operateParams = (params)=>{
    const paramsList = Object.keys(params);
    if(paramsList && paramsList.length){
         return '?'+qs.stringify(params)
    }
    return ''
} 
 

   

// 二、数据处理部分 
// 更新出库区段数据
export const updateOutflowBlockData = (params={},data={},method='get')=>{
    return request({
        // url:'/QS_BP/OutFlow/update-flow-list'+operateParams(params),
        url:'/QS_BP/OutFlow/update-many-out'+operateParams(params),
        method,
        data
    })  
}  