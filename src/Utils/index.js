
// 引入时间模块
import moment from 'moment';

// （0.修改fixed处理后的数据（对5进行特殊化处理）
export const dealToFixedData = (data, fixNum)=>{
    data = data.toString()
    let data_arr = data.split(".")
    let len = data_arr.length
     
    let lastNum = data_arr[len-1].slice(fixNum,fixNum+1)
    if(lastNum == 5){ 
        let step = 0.1;
        let amount = 0.1;
        let i = fixNum;
        while(i -- ){
            amount *= step
        }
        data = parseFloat(data) + amount 
    }
    data = parseFloat(data).toFixed(fixNum)
    return data;
} 
// （1.时间计时器
export const changeIntervalTime = ()=>{
    const today = new Date();
    const nowDate = today.toLocaleDateString().replace(/[\/]/gi,"-")
    let nowTime = today.toLocaleTimeString().slice(4)
        let pre_data_prefix =  today.toLocaleTimeString().slice(0,2);
        let pre_data = parseInt(today.toLocaleTimeString().match(/(\d+):/gi));
        if(pre_data_prefix == "下午"){
            nowTime = (pre_data + 12) +":"+ nowTime;
        }else{
            if(pre_data < 10)
                nowTime = "0"+pre_data  +":" + nowTime;
            else
                nowTime = pre_data  +":" + nowTime;
        }
    return nowDate  + " " + nowTime
}
// （2.格式化日期数据
export const formatDate = (date,fmt)=>{ 
    // var dateTime = Date.now();//获取日期时间的date类型
    // dateTime = dateTime.setDate(dateTime.getDate()-1);//传入时间的前一天
    // var time = new Date(dateTime).Format("yyyy-MM-dd HH:mm:ss");//按照格式编译转换
    // yyyy MM dd  HH mm ss
    var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "H+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
} 
// （3.反解析格式化日期数据 x年x月x日
export const reverseFormatDate = (dateString) =>{
    if(dateString){
        return  dateString.slice(0,4) + '年' + dateString.slice(5,7) + '月' + dateString.slice(8,10) + '日'
    }else{
        return '-'
    }
}
// （4.反解析格式化日期数据 x-x-x x时
export const reverseFormatDate2 = (dateString) =>{
    if(dateString){
        return dateString.slice(0,4) + '-' + dateString.slice(5,7) + '-' + dateString.slice(8,10) + ' ' + dateString.slice(11,13) + '时'
    }else{
        return '-'
    }
}
// （5.日期前缀
export const datePrefix = (arr,len=10)=>{
    if(arr){
        return arr[0].slice(0,len);
    }
    return ''
}
// （6.日期列表排序
export const dateSort = (arr,len=10)=>{
    // 2022-12-10 10:10:11
    // 12345678910
    // let new_arr = [];
    // let prefix = datePrefix(arr,len)
    // new_arr = arr.map(item=>{
    //     return item.slice(len);
    // })
    // new_arr = new_arr.sort(); 
    // new_arr = new_arr.map(item=>{
    //     return prefix + item;
    // })
    return arr.sort();
} 
// （6.1 获取当前的列表数据
export const getDatetimeList = ()=>{
    // 2022-06-16 01:00:00
    // 2022-06-15 10:00:00
    let hour = moment().format('HH');
    let list = [];
    let prefix = ''
    if(hour >= 8 && hour <= 23){ 
        // [8,24)
        // prefix = '2022-06-15' 
        prefix = moment().format('YYYY-MM-DD')
        for(let i=8;i<=hour;i++){ 
            var h = i < 10 ? '0'+i : i;
            list.push(`${prefix} ${h}:00:00`)
        }
    }else{
        // [8,24)
        let hour1 = 23
        // prefix = '2022-06-15' 
        prefix = moment().subtract(1, 'day').format('YYYY-MM-DD'); 
        for(let i=8;i<=hour1;i++){ 
            var h = i < 10 ? '0'+i : i;
            list.push(`${prefix} ${h}:00:00`)
        }
        // [0,8)   
        // prefix = '2022-06-16'  
        prefix = moment().format('YYYY-MM-DD')
        for(let i=0;i<=hour;i++){ 
            var h = i < 10 ? '0'+i : i;
            list.push(`${prefix} ${h}:00:00`)
        }
    }
    return list
} 
// （7.修改Momment的数据类型(当前日期的指定日期格式)
export const changeMomentType = (moment,formatStr)=>{
    return moment(moment().format(formatStr),formatStr)
} 
// （8.将空数据替换成 '-', 保留两位小数
export const changeDataLine = (data, defaultEmpha='-')=>{
    return (data || data == 0) ? changeDataFixed(data ,2) : defaultEmpha
}
// （9.将空数据替换成 '-', 保留一位小数
export const changeDataLine2 = (data, defaultEmpha='-')=>{
    return (data || data == 0) ? changeDataFixed1(data,1) : defaultEmpha
} 
// （10.将数据保留两位小数
export const changeDataFixed = (data, fixNum)=>{
    // let new_data =  parseFloat(data).toFixed(fixNum)

    // 处理toFixed的问题， （最后一位是小数的没有进位） 
    let new_data = dealToFixedData(data,fixNum)

    // if(new_data == parseInt(new_data)){
    //     new_data = parseInt(new_data)
    // }else 
    if(new_data == parseInt(new_data) + 0.5){
        new_data = parseInt(new_data) + 0.5
    }
    new_data = new_data == 10000 ? 'N/A' : new_data
    return new_data
}
// （11.最大化将数据保留两位小数
export const changeDataFixed1 = (data, fixNum)=>{
    // let new_data =  parseFloat(data).toFixed(fixNum)

    // 处理toFixed的问题， （最后一位是小数的没有进位） 
    let new_data = dealToFixedData(data,fixNum)
 
    if(new_data == parseInt(new_data)){
        new_data = parseInt(new_data)
    }else if(new_data == parseInt(new_data) + 0.5){
        new_data = parseInt(new_data) + 0.5
    }
    new_data = new_data == 10000 ? 'N/A' : new_data
    return new_data
}
// （12.验证当前列表是否有指定位置的数据
export const judgeListData = (list,index,property)=>{
    if(list && list.length >= index+1 && index >= 0){
        if(property != null)
            return list[index][property]
        else
            return list[index]
    }else{
        return null;
    }
}
// （13.验证当前对象是否有指定数据
export const getObjectData = (object,property)=>{ 
        return object ? object[property]  : null
}
// （13.验证当前对象是否有指定数据
export const getObjectData2 = (object,property)=>{ 
        return object ? object[property]  : []
} 
// （14.设置节点的数据
export function setDomInnerText(element,text){
    if(element)
        element.innerText = text
}
// （15.切割水库数据（每日的时数据）（8时开始，第二天的7时结束, 每小时一个数据）
export function stripDayUselessData(newList){ 
    // 当前的时间
    let preTime = parseInt(moment().format("HH"));
    // 切割超出的时数据  
    let dayLen = preTime -  8;
    let nowTimeCount =  Math.ceil(dayLen) + 1
    if(newList){ 
        if(preTime > 8 ){ 
            // 白天的数据
            if(newList.length > nowTimeCount)
                newList =  newList.slice(0,nowTimeCount) 
        }else{ 
            // 凌晨的数据
            if(newList.length > nowTimeCount + 24 ){ 
                newList =  newList.slice(0,nowTimeCount + 24 )
            }
        }
    }
    return newList;
} 
// （16.切割水库数据（每日的5分钟数据）（8时开始，第二天的7时结束, 每5分钟一个数据）
export function stripDayUselessData2(newList){ 
    // 当前的时间
    let preTime = parseInt(moment().format("HH"));
    // 切割超出的时数据  
    let dayLen = preTime -  8;
    let nowTimeCount =  dayLen * 12 + Math.ceil( parseInt(moment().format("mm")) / 5 )
    if(newList){ 
        if(preTime > 8 ){ 
            // 白天的数据
            if(newList.length > nowTimeCount)
                newList =  newList.slice(0,nowTimeCount) 
        }else{  
            // 凌晨的数据
            if(newList.length > nowTimeCount + 16 * 18){ 
                newList =  newList.slice(0,nowTimeCount + 16 * 18 )
            } 
        }
    }
    return newList;
}
// （17.切割水库数据（每月的日数据）（每月初到当前的时间）
export function stripMonthUselessData(newList){
    let dayLen = parseInt(moment().format("D")) 
    if(newList && newList.length > dayLen)
        newList =  newList.slice(0,dayLen) 
    return newList
}
// （4. 获取不超过半小时的数据   08:00
// 对数据进行取舍, 注意8点的分界线 
export function  ceilHalfMinute(data){  
    // let arr = data.split(":")
    // if(arr.length != 2){
    //     return null;
    // } 
    // if(parseInt(arr[1])>=30){
    //     arr[1] = '30'
    // }else{ 
    //     arr[1] = '00'
    // } 2019-22-01 08:15:30
    // return arr.join(':');
    return data.slice(0,17)+"00"
 }




export default {
    changeIntervalTime, 
    changeDataLine,changeDataLine2,changeDataFixed,reverseFormatDate,
    changeMomentType,
    dateSort,datePrefix,
    judgeListData,getObjectData,getObjectData2,
    stripDayUselessData,stripDayUselessData2,stripMonthUselessData,
    getDatetimeList,
    setDomInnerText,ceilHalfMinute
}
