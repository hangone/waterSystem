import React,{useEffect,useState,useRef, Fragment} from 'react' ;
import { DatePicker, Button,Menu, Dropdown  ,Table,Radio,Spin  } from 'antd'; 
import { MessageTool,MessageToolClear } from 'Components/Tools/MessageTool';
import { getWaterChangeMinute,getRainChangeMinute } from 'Services/Home'; 
// import { getWhouseChangeMinute,getInFlowChangeMinute,getOutFlowChangeMinute } from 'Services/Home'; 
import {getWaterInstant,getRainInstant,getCapInstant,getInflowInstant,getOutflowInstant } from 'Services/Home/minute'; 
import { changeDataLine,changeDataLine2,reverseFormatDate,getObjectData,getObjectData2 } from 'Utils'
import { resetTableTitleWidth} from 'Utils/layoutreset'

import { CacheUtils} from 'Services/cacheUtils'; 

// 引入兄弟传值模块 
import PubSub from 'pubsub-js'

// 引入时间模块
import moment from 'moment';

import * as echarts from 'echarts'
import Common from 'Common'; 
import {formatDate} from 'Utils'
import 'Assets/css/comm.css';
import './index.css';
 

import bgHome from '../../../../Assets/images/pic/bg-home.png';
import flagWater from '../../../../Assets/images/pic/flag-water.png';
import flagRain from '../../../../Assets/images/pic/flag-rain.png';
 

function WaterChange(){    
    // 端点编码
    let typeList1  = []  
    let typeList2  = []  
    // 计时器
    let ITimer = null;
    // let [ITimerResponse,setITimerResponse] = useState(null);
    // 图的实例
    let myChartTop = null;
    let myChartMiddle = null;
    let myChartBottom = null;
    // 设置响应式图的实例
    let [myChartTopRes,setMyChartTopRes] = useState(null)
    let [myChartMiddleRes,setMyChartMiddleRes] = useState(null)
    let [myChartBottomRes,setMyChartBottomRes] = useState(null) 
    // 图表节点
    const echartTopNodeRef = useRef();
    const echartMiddleNodeRef = useRef();
    const echartBottomNodeRef = useRef();
    // 顶部更多显示栏 
    const preIsShowTitle =  sessionStorage.getItem("water_isShowTitle")
    const [isShowTitle,setIsShowTitle] = useState((preIsShowTitle == 'true') ? preIsShowTitle :false)
    // 单选按钮,日、 月、周
    const [radioItem, setRadioItem] = useState('day')
    // 是否正在加载
    const [isLoading,setIsLoading] = useState(false)
    const [isShowEchart,setIsShowEchart] = useState(false)
    // 表格是否扩展
    const [activeMenuName,setActiveMenuName] = useState( sessionStorage.getItem("water_isTableCollapse") == 'true' ?  '扩展型' : '紧缩型'  )
    // const [isTableCollapse,setIsTableCollapse] = useState( sessionStorage.getItem("water_isTableCollapse")  == 'true'  ? true : false)
    const [isTableCollapse,setIsTableCollapse] = useState(true)

      
  
    // 二、监听数据
    // 初始化加载
    useEffect(()=>{
        try{  
            // const preIsShowTitle =  sessionStorage.getItem("water_isShowTitle")
            // setIsShowTitle (preIsShowTitle == 'true' ? preIsShowTitle :false)
            
            // 清除提示
            MessageToolClear(); 
            setIsLoading(true)
            // 获取平均水位站点数据
            typeList1  = Common.waterData 
            typeList2  = Common.rainData 

            // 去除末尾的厂房站雨量
            typeList2 = typeList2.slice(0,typeList2.length-1)
              
            // 首次查询数据 
            onSearch('day',true);

            ITimer = setInterval(()=>{ 
                // 查询表格数据
                // onSearch(Common.waterData,t_columns.length - 1);
                onSearch(radioItem);
                // 更新提示
                MessageTool("数据已经更新","success")
            },Common.refreshDelay)  
            sessionStorage.setItem('ITimerResponse',ITimer)
 
        }catch(err){
            console.log("出现异常",err)
            MessageTool('系统出现异常！请刷新重试','error')
        }  
        return ()=>{
            //  清除定时器
            let ITimerResponse = sessionStorage.getItem('ITimerResponse' )
            if(ITimerResponse) clearInterval(ITimerResponse) 
            if(ITimer) clearInterval(ITimer) 
            // 取消消息订阅
            PubSub.unsubscribe("water_titleMenu");  

            // 清除当前的请求
            // CacheUtils.clearCache()
            console.log("11111111111111111111111111已经清除当前的请求")
        }
    },[]) 
    // 监听页面的尺寸变化 
    useEffect(() => {    
        // 重新设置表头宽度 
        window.addEventListener("resize", function() {  
            resetTableTitleWidth() 
        });   
        return () => {
            window.removeEventListener("resize",()=>{});
        } 
    }, [window]);   
 
    // 三、功能操作 
    // 搜索表格信息,(先获取远程数据，再绘制表格)
    const onSearch = (t_radioItem=null,isInit = false)=>{    
        switch(t_radioItem){
            case 'day':
                getDayData(isInit);
                break;  
            default:
                console.log("选择错误！")
                break; 
        }
    } 

    // 五、获取远程数据
 // 获取日数据
 const getDayData = async(isInit=false) =>{ 
    try{  
        // 水位数据
        let dayWater = await getWaterInstant()  
        if(dayWater != undefined && Array.isArray(dayWater) && dayWater.length >= 3){
            let w0 = changeDataLine(dayWater[0])
            let w1 = changeDataLine(dayWater[2])
            let w2 = changeDataLine(dayWater[1]) 
            let a;
            a = document.querySelector('.flow-flag-div>div:nth-child(6) .inner-txt span.inner')
            if(a) a.innerText = w0
            a = document.querySelector('.flow-flag-div>div:nth-child(7) .inner-txt span.inner')
            if(a) a.innerText = w1
            a = document.querySelector('.flow-flag-div>div:nth-child(8) .inner-txt span.inner')
            if(a) a.innerText = w2
            a = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inner-water')
            if(a) a.innerText = w2
        }
        // 雨量数据
        let dayRain = await getRainInstant()  
        if(dayRain != undefined && Array.isArray(dayRain) && dayRain.length >= 5){
            let r0 = changeDataLine2(dayRain[4])
            let r1 = changeDataLine2(dayRain[3])
            let r2 = changeDataLine2(dayRain[1]) 
            let r3 = changeDataLine2(dayRain[2]) 
            let r4 = changeDataLine2(dayRain[0]) 
            let a;
            a = document.querySelector('.flow-flag-div>div:nth-child(1) .inner-txt span.inner')
            if(a) a.innerText = r0
            a = document.querySelector('.flow-flag-div>div:nth-child(2) .inner-txt span.inner')
            if(a) a.innerText = r1
            a = document.querySelector('.flow-flag-div>div:nth-child(3) .inner-txt span.inner')
            if(a) a.innerText = r2
            a = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inner')
            if(a) a.innerText = r3
            a = document.querySelector('.flow-flag-div>div:nth-child(5) .inner-txt span.inner')
            if(a) a.innerText = r4
        }

        // 入库流量，出库流量，库容
        let dayCap = await getCapInstant()    
        if(dayCap != null && dayCap != undefined) // 结果是一个对象
          dayCap = dayCap.data 
        if(dayCap  != undefined){
            let keys = Object.keys(dayCap ).sort();
            var capLen = keys.length
            if(capLen > 0){ 
                let cap = dayCap[keys[capLen-1]]
                // 如果是0,或者空，则考虑使用上一个数据
                if((cap == 0 || cap == null)  && capLen-2 >= 0 ){
                    cap = dayCap.data[keys[capLen-2]]
                } 
                let a;
                a = document.querySelector('.flow-flag-div>div:nth-child(7) .inner-txt span.kurong')
                if(a) a.innerText = changeDataLine(cap)
            }
        }
        let dayInflow = await getInflowInstant()    
        // if(dayInflow != null && dayInflow != undefined)   // 结果是一个列表
        //     dayInflow = dayInflow.data  
        console.log(dayInflow)
        if(dayInflow != undefined ){ 
            var inflowLen = dayInflow.length
            if(inflowLen > 0){ 
                let inflow = dayInflow[inflowLen-1]
                // 如果是0,或者空，则考虑使用上一个数据
                if((inflow == 0 || inflow == null)  && inflowLen-2 >= 0 ){
                    inflow = dayInflow[inflowLen-2]
                } 
                let a;
                a = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inflow')
                if(a) a.innerText = changeDataLine(inflow) 
            }
        }
        let dayOutflow = await getOutflowInstant()    
        // if(dayOutflow != null && dayOutflow != undefined)  // 结果是一个列表
        //     dayOutflow = dayOutflow.data  
        console.log(outflowLen)
        if(dayOutflow != undefined ){ 
            var outflowLen = dayOutflow.length
            if(outflowLen > 0){ 
                let outflow = dayOutflow[outflowLen-1]
                // 如果是0,或者空，则考虑使用上一个数据
                if((outflow == 0 || outflow == null)  && outflowLen-2 >= 0 ){
                    outflow = dayOutflow[outflowLen-2]
                }  
                let a;
                a = document.querySelector('.flow-flag-div>div:nth-child(6) .inner-txt span.outflow')
                if(a) a.innerText = changeDataLine(outflow) 
            }
        }
 
        // 暂停旋转器
        setIsLoading(false)   
    }catch(err){ 
        
        // 暂停旋转器
        setIsLoading(false)  

        console.log("请求出现异常！请重试",err)
        MessageTool('请求出现异常！请重试','error')
    }
}    
  

    return (
        <div className='waterChange-div homeTable-div commTable-div'  >  
            <div className='body-bottom-div' style={{'background':'white'}}>  
                <Spin tip="加载数据中" spinning={isLoading} style={{display:isLoading ? 'flex' : 'none'}}></Spin>
                <div className='bottom-top home-img-div' style={{height:isTableCollapse ? 'inherit' : '50%',position:isTableCollapse ? 'absolute' : 'relative'}}>     
                    <img src={bgHome} className="bg-img" alt="" />
                    <div className='flow-flag-div '>
                        {/* 雨量部分 */} 
                        <div className='flow-item rain-item'>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>站点:张佳坊</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>  
                            </div>
                        </div>     
                        <div className='flow-item rain-item'>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>站点:西江口</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>  
                            </div>
                        </div>     
                        <div className='flow-item rain-item'>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>站点:老庵里</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>  
                            </div>
                        </div>     
                        <div className='flow-item rain-item'>
                            <div className='inner-txt'>
                               <div className='title'>站点:新泉站</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>   
                               <div>水位:<span className='inner-water'>*</span>&nbsp;m</div>  
                               <div>入库流量:<span className='inflow'>*</span>&nbsp;m³/s</div> 
                            </div>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                        </div>     
                        <div className='flow-item rain-item'>
                            <div className='inner-txt'>
                               <div className='title'>站点:王狗冲</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>  
                            </div>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                        </div>     
                        {/* 水位部分 */}
                        <div className='flow-item water-item'>
                            <div className='icon-img'><img src={flagWater} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>站点:厂房站</div> 
                               <div>水位:<span className='inner'>*</span>&nbsp;m</div>   
                               <div>出库流量:<span className='outflow'>*</span>&nbsp;m³/s</div> 
                            </div>
                        </div>     
                        <div className='flow-item water-item'>
                            <div className='inner-txt'>
                               <div className='title'>站点:闸室站</div>  
                               <div>水位:<span className='inner'>*</span>&nbsp;m</div>  
                               <div>库容:<span className='kurong'>*</span>&nbsp;wm³</div>    
                            </div>
                            <div className='icon-img'><img src={flagWater} alt="" /></div>
                        </div>     
                        <div className='flow-item water-item' style={{'display':'none'}}>
                            <div className='icon-img'><img src={flagWater} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>站点:新泉站</div> 
                               <div>水位:<span className='inner'>*</span>&nbsp;m</div>  
                            </div>
                        </div>     

                    </div>
                </div>  
            </div>
        </div>
    )
}

export default WaterChange;