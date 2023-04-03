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

// 5分钟水雨情数据(新)
export const getWaterMinute1 = (params={},data={},method='get')=>{
    // 闸室站:
    return request({ 
        url:'/QS_BP/minute/zhashi'+operateParams(params),
        method,
        data
    })
}  
export const getWaterMinute2 = (params={},data={},method='get')=>{
    // 新泉站:
    return request({ 
        url:'/QS_BP/minute/xinquan'+operateParams(params),
        method,
        data
    })
}  
export const getWaterMinute3 = (params={},data={},method='get')=>{
    // 厂房站:
    return request({ 
        url:'/QS_BP/minute/changfang'+operateParams(params),
        method,
        data
    })
}  
export const getRainMinute1 = (params={},data={},method='get')=>{
    // 新泉雨量:
    return request({ 
        url:'/QS_BP/minute/xinrain'+operateParams(params),
        method,
        data
    })
}  
export const getRainMinute2 = (params={},data={},method='get')=>{
    // 西江口雨量:
    return request({ 
        url:'/QS_BP/minute/xirain'+operateParams(params),
        method,
        data
    })
}  
export const getRainMinute3 = (params={},data={},method='get')=>{
    // 老庵里雨量:
    return request({ 
        url:'/QS_BP/minute/laorain'+operateParams(params),
        method,
        data
    })
}  
export const getRainMinute4 = (params={},data={},method='get')=>{
    // 张佳坊雨量:
    return request({ 
        url:'/QS_BP/minute/zhangrain'+operateParams(params),
        method,
        data
    })
}  
export const getRainMinute5 = (params={},data={},method='get')=>{
    // 王狗冲雨量:
    return request({ 
        url:'/QS_BP/minute/wangrain'+operateParams(params),
        method,
        data
    })
}  
export const getCapMinute1 = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_BP/minute/cap'+operateParams(params),
        method,
        data
    })
}  
export const getInflowMinute2 = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_BP/minute/inflow'+operateParams(params),
        method,
        data
    })
}  
export const getOutflowMinute3 = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_BP/minute/outflow'+operateParams(params),
        method,
        data
    })
}  


 

