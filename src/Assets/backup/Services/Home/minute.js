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

  

// 一、实时监测数据 
// 实时主页数据
// export const getWaterInstant = (params={},data={},method='get')=>{
//     // 闸室站:
//     return request({ 
//         url:'/BigDisplay/k/rtw'+operateParams(params),
//         method,
//         data
//     })
 
//     // return new Promise(resolve=>{
//     //     resolve(
//     //        [157.73,256.789,242.01,null,null,null,null,null]
//     //     )
//     // })
// }  
// export const getRainInstant = (params={},data={},method='get')=>{
//     // 闸室站:
//     return request({ 
//         url:'/BigDisplay/tprec/rain'+operateParams(params),
//         method,
//         data
//     })
 
//     // return new Promise(resolve=>{
//     //     resolve(
//     //        [157.73,256.789,242.01,null,null,null,null,null]
//     //     )
//     // })
// }  
// export const getCapInstant = (params={},data={},method='get')=>{
//     // 闸室站:
//     return request({ 
//         url:'/BigDisplay/Cap/listDayByHours'+operateParams(params),
//         method,
//         data
//     })
 
//     // return new Promise(resolve=>{
//     //     resolve(
//     //        [157.73,256.789,242.01,null,null,null,null,null]
//     //     )
//     // })
// }  
// export const getInflowInstant = (params={},data={},method='get')=>{
//     // 闸室站:
//     return request({ 
//         url:'/BigDisplay/InFlow/listDayByHours2'+operateParams(params),
//         method,
//         data
//     })
 
//     // return new Promise(resolve=>{
//     //     resolve(
//     //        [157.73,256.789,242.01,null,null,null,null,null]
//     //     )
//     // })
// }  
// export const getOutflowInstant = (params={},data={},method='get')=>{
//     // 闸室站:
//     return request({ 
//         url:'/BigDisplay/OutFlow/listDayByHours2'+operateParams(params),
//         method,
//         data
//     })
 
//     // return new Promise(resolve=>{
//     //     resolve(
//     //        [157.73,256.789,242.01,null,null,null,null,null]
//     //     )
//     // })
// }  


// 5分钟水雨情数据(新)
export const getWaterMinute1 = (params={},data={},method='get')=>{
    // 闸室站:
    return request({ 
        url:'/QS_AP/minute/zhashi'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getWaterMinute2 = (params={},data={},method='get')=>{
    // 新泉站:
    return request({ 
        url:'/QS_AP/minute/xinquan'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getWaterMinute3 = (params={},data={},method='get')=>{
    // 厂房站:
    return request({ 
        url:'/QS_AP/minute/changfang'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getRainMinute1 = (params={},data={},method='get')=>{
    // 新泉雨量:
    return request({ 
        url:'/QS_AP/minute/xinrain'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getRainMinute2 = (params={},data={},method='get')=>{
    // 西江口雨量:
    return request({ 
        url:'/QS_AP/minute/xirain'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getRainMinute3 = (params={},data={},method='get')=>{
    // 老庵里雨量:
    return request({ 
        url:'/QS_AP/minute/laorain'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getRainMinute4 = (params={},data={},method='get')=>{
    // 张佳坊雨量:
    return request({ 
        url:'/QS_AP/minute/zhangrain'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getRainMinute5 = (params={},data={},method='get')=>{
    // 王狗冲雨量:
    return request({ 
        url:'/QS_AP/minute/wangrain'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getCapMinute1 = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_AP/minute/cap'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getInflowMinute2 = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_AP/minute/inflow'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
export const getOutflowMinute3 = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_AP/minute/outflow'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  


 

