import { request } from "Services/request";
import qs from 'querystring';
import Common from 'Common' 

// 处理params函数
const operateParams = (params)=>{
    const paramsList = Object.keys(params);
    if(paramsList && paramsList.length){
         return '?'+qs.stringify(params)
    }
    return ''
} 

  

// 一、实时监测数据
// （1.实时水位数据
export const getWaterChangeDay = (params={},data={},method='get')=>{
    return request({
        url:'/QS_AP/wrl/listDayByHours2'+operateParams(params),
        method,
        data
    })

    // return new Promise(resolve=>{
    //     resolve(
    //         [[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.931},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.726},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.603333}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.938571},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.725},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.6}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.938},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.725},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.596666}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.931666},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.725},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.603333}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.93},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.726},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.596666}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.935},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.728},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.6}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.935714},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.73},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.601}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.932222},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.732},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.6}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.93125},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.757},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.601666}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.95},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.7375},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.6}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.96},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.737},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.595}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.96},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.738},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.595}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.953333},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.74},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.595}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.955555},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.741},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.593333}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.944},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.74},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.59375}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.945},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.739},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.592}]]
    //     )
    // })
}
export const getWaterChangeWeek = (params={},data={},method='get')=>{
    return request({
        url:'/QS_AP/wrl/listMonthByDays2'+operateParams(params),
        method,
        data
    })

    // return new Promise(resolve=>{
    //     resolve(
    //         [[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.639358},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.730187},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.598502}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.882386},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.726},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.596122}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.941293},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.734421},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.597747}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}]]
    //     )
    // })
}
export const getWaterChangeMonth = (params={},data={},method='get')=>{
    return request({
        url:'/QS_AP/wrl/listMonthByDays2'+operateParams(params),
        method,
        data
    })

    // return new Promise(resolve=>{
    //     resolve(
    //         [[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.639358},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.730187},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.598502}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.882386},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.726},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.596122}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":239.941293},{"stcd":"0721141131","sttp":"RR","z":null,"rz":256.734421},{"stcd":"0721141132","sttp":"RR","z":null,"rz":157.597747}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}],[{"stcd":"0721141130","sttp":"RR","z":null,"rz":null},{"stcd":"0721141131","sttp":"RR","z":null,"rz":null},{"stcd":"0721141132","sttp":"RR","z":null,"rz":null}]]
    //     )
    // })
} 


// (2.实时雨量数据
export const getRainChangeDay = (params={},data={},method='get')=>{
    return request({
        url:'/QS_AP/pre/thPreListDayByHours2'+operateParams(params),
        method,
        data
    })

    // return new Promise(resolve=>{
    //     resolve(
    //         [[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}]]
    //     )
    // })
}
export const getRainChangeWeek = (params={},data={},method='get')=>{
    return request({
        url:'/QS_AP/pre/thPreListMonthByDays2'+operateParams(params),
        method,
        data
    })
    
    // return new Promise(resolve=>{
    //     resolve(
    //         [[{"stcd":"0062336500","drp":5.0},{"stcd":"0062336540","drp":5.5},{"stcd":"0062336560","drp":3.0},{"stcd":"0062336600","drp":6.5},{"stcd":"0062336640","drp":3.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":3.5},{"stcd":"0721141132","drp":2.5}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}]]
    //     )
    // })
}
export const getRainChangeMonth = (params={},data={},method='get')=>{
    return request({
        url:'/QS_AP/pre/thPreListMonthByDays2'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         [[{"stcd":"0062336500","drp":5.0},{"stcd":"0062336540","drp":5.5},{"stcd":"0062336560","drp":3.0},{"stcd":"0062336600","drp":6.5},{"stcd":"0062336640","drp":3.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":3.5},{"stcd":"0721141132","drp":2.5}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}],[{"stcd":"0062336500","drp":0.0},{"stcd":"0062336540","drp":0.0},{"stcd":"0062336560","drp":0.0},{"stcd":"0062336600","drp":0.0},{"stcd":"0062336640","drp":0.0},{"stcd":"0721141130","drp":0.0},{"stcd":"0721141131","drp":0.0},{"stcd":"0721141132","drp":0.0}]]
    //     )
    // })
} 

 
// (3. 实时库容数据  
export const getCapChangeDay = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_AP/Cap/listDayByHours'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
}  
// (4. 入库流量数据 
export const getInflowChangeDay = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_AP/InFlow/listDayByHours'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
} 
// (5. 出库流量数据 
export const getOutflowChangeDay = (params={},data={},method='get')=>{
    return request({ 
        url:'/QS_AP/OutFlow/listDayByHours'+operateParams(params),
        method,
        data
    })
 
    // return new Promise(resolve=>{
    //     resolve(
    //         {"msg":"ok","data":{"2022-04-03 22:00:00":7852.639999999997,"2022-04-03 13:00:00":7849.85,"2022-04-03 12:00:00":7848.300000000002,"2022-04-03 09:00:00":7850.957009999999,"2022-04-03 19:00:00":7857.600000000002,"2022-04-03 17:00:00":7854.499999999996,"2022-04-03 14:00:00":7850.071339999997,"2022-04-03 18:00:00":7857.600000000002,"2022-04-03 23:00:00":7853.466459999998,"2022-04-03 08:00:00":7848.610000000003,"2022-04-03 16:00:00":7848.687500000002,"2022-04-03 15:00:00":7848.988819999999,"2022-04-03 10:00:00":7850.779999999996,"2022-04-03 20:00:00":7855.5332299999955,"2022-04-03 11:00:00":7848.816460000002,"2022-04-03 21:00:00":7856.222050000001}}
    //     )
    // })
} 

