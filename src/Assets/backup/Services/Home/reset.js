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
// 出库区段数据 
export const getOutflowBlockData = (params={},data={},method='get')=>{
    return request({
        url:'/QS_AP/OutFlow/find-flow-by-time'+operateParams(params),
        method,
        data
    })  
}  
// 更新出库区段数据
export const updateOutflowBlockData = (params={},data={},method='get')=>{
    return request({
        url:'/QS_AP/OutFlow/update-flow-list'+operateParams(params),
        method,
        data
    })  
}  