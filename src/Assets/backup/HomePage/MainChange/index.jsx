import React,{useEffect,useState,useRef, Fragment} from 'react' ;
import { Spin  } from 'antd'; 
import { MessageTool,MessageToolClear } from 'Components/Tools/MessageTool'; 
import { getWaterChangeDay ,getRainChangeDay,
    getCapChangeDay,getInflowChangeDay,getOutflowChangeDay } from 'Services/Home';  
import { changeDataLine,changeDataLine2,dateSort,judgeListData,
    stripDayUselessData,setDomInnerText } from 'Utils'
import { resetTableTitleWidth} from 'Utils/layoutreset'
 

// 引入兄弟传值模块 
import PubSub from 'pubsub-js'

// 引入时间模块
import moment from 'moment';

import * as echarts from 'echarts'
import Common from 'Common'; 
import {formatDate} from 'Utils'
import 'Assets/css/comm.less';
import './index.less';
 

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
            const preIsShowTitle =  sessionStorage.getItem("water_isShowTitle")
            setIsShowTitle (preIsShowTitle == 'true' ? preIsShowTitle :false)
            
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
        }
    } 

// 五、获取日数据
 const getDayData = async(isInit=false) =>{ 
    try{  
        let preTime = parseInt(moment().format("HH"));

        // 1.水位数据
        let dayWater = await getWaterChangeDay() 
        // 保证数据存在
        if(dayWater){ 
            // 切割超出的时数据   
            dayWater = stripDayUselessData(dayWater) 
            // 获取当前时间的三个站点水位数据
            dayWater = judgeListData(dayWater,dayWater.length-1,null)
        }
        // 设置数据
        dayWater && dayWater.forEach(item=>{
            switch(item.stcd){
                case '0721141132': // 厂房站
                    let w2 = changeDataLine(item.rz) 
                    let a2 = document.querySelector('.flow-flag-div>div:nth-child(6) .inner-txt span.inner')
                    setDomInnerText(a2,w2)
                    break;
                case '0721141130':  // 闸室
                    let w0 = changeDataLine(item.rz) 
                    let a0 = document.querySelector('.flow-flag-div>div:nth-child(7) .inner-txt span.inner')
                    setDomInnerText(a0,w0)
                    break;
                case '0721141131': // 新泉站
                    let w1 = changeDataLine(item.rz) 
                    // let a1 = document.querySelector('.flow-flag-div>div:nth-child(8) .inner-txt span.inner')
                    // if(a1) a1.innerText = w1 
                    let a1 = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inner-water')
                    setDomInnerText(a1,w1)
                    break;
            }
        }) 

        // 2.雨量数据
        let dayRain = await getRainChangeDay()  
        // 保证数据存在
        if(dayRain){ 
            // 切割超出的时数据   
            dayRain = stripDayUselessData(dayRain) 
            // 获取当前时间的五个站点雨量数据
            dayRain = judgeListData(dayRain,dayRain.length-1,null)
        } 
        // 设置数据
        dayRain && dayRain.forEach(item=>{
            switch(item.stcd){
                case '0062336500': // 王狗冲
                    let drp1 = changeDataLine2(item.drp) 
                    let a1 = document.querySelector('.flow-flag-div>div:nth-child(5) .inner-txt span.inner')
                    setDomInnerText(a1,drp1)
                    break;
                case '0062336540':  // 老庵里
                    let drp0 = changeDataLine2(item.drp) 
                    let a0 = document.querySelector('.flow-flag-div>div:nth-child(3) .inner-txt span.inner')
                    setDomInnerText(a0,drp0)
                    break;
                case '0062336560': // 新泉站
                    let drp2 = changeDataLine2(item.drp) 
                    let a2 = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inner')
                    setDomInnerText(a2,drp2)
                    break; 
                case '0062336600': // 西江口
                    let drp3 = changeDataLine2(item.drp) 
                    let a3 = document.querySelector('.flow-flag-div>div:nth-child(2) .inner-txt span.inner')
                    setDomInnerText(a3,drp3)
                    break; 
                case '0062336640': // 张佳坊
                    let drp4 = changeDataLine2(item.drp) 
                    let a4 = document.querySelector('.flow-flag-div>div:nth-child(1) .inner-txt span.inner')
                    setDomInnerText(a4,drp4)
                    break; 
            }
        }) 
 
        let day1 = await getCapChangeDay() 
        let day2 = await getInflowChangeDay() 
        let day3 = await getOutflowChangeDay()  
        
        // 3.获取库容数据 
        if(day1 && day1.data){ 
            // 获取今日的所有库容数据
            let dayData1 = dateSort(Object.keys(day1.data)).map(item=>{
                return day1.data[item]
            }) 
            // 切割超出的时数据   
            dayData1 = stripDayUselessData(dayData1) 
            // 获取当前时间的库容数据
            dayData1 = judgeListData(dayData1,dayData1.length-1,null)
            // 小数的取舍
            dayData1 = changeDataLine(dayData1)
            // 设置库容
            let a1 = document.querySelector('.flow-flag-div>div:nth-child(7) .inner-txt span.kurong')
            setDomInnerText(a1,dayData1)
        } 
        // 4.获取入库流量数据
        if(day2 && day2.data){ 
            // 获取今日的所有入库流量数据
            let dayData2 = dateSort(Object.keys(day2.data)).map(item=>{
                return day2.data[item]
            })
            // 切割超出的时数据   
            dayData2 = stripDayUselessData(dayData2) 
            // 获取当前时间的库容数据
            dayData2 = judgeListData(dayData2,dayData2.length-1,null)
            // 小数的取舍
            dayData2 = changeDataLine(dayData2)
            // 设置入库流量
            let a2 = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inflow')
            setDomInnerText(a2,dayData2)
        }
        // 5.获取出库流量数据
        if(day3 && day3.data){
            // 获取今日的所有出库流量数据
            let dayData3 = dateSort(Object.keys(day3.data)).map(item=>{
                return day3.data[item]
            }) 
            // 切割超出的时数据   
            dayData3 = stripDayUselessData(dayData3) 
            // 获取当前时间的库容数据
            dayData3 = judgeListData(dayData3,dayData3.length-1,null)
            // 小数的取舍
            dayData3 = changeDataLine(dayData3)
            // 设置出库流量
            let a3 = document.querySelector('.flow-flag-div>div:nth-child(6) .inner-txt span.outflow')
            setDomInnerText(a3,dayData3)
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
                               <div className='title'>张佳坊</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>  
                            </div>
                        </div>     
                        <div className='flow-item rain-item'>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>西江口</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>  
                            </div>
                        </div>     
                        <div className='flow-item rain-item'>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>老庵里</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>  
                            </div>
                        </div>     
                        <div className='flow-item rain-item'>
                            <div className='inner-txt'>
                               <div className='title'>新泉站</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>   
                               <div>水位:<span className='inner-water'>*</span>&nbsp;m</div>  
                               <div>入库流量:<span className='inflow'>*</span>&nbsp;m³/s</div> 
                            </div>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                        </div>     
                        <div className='flow-item rain-item'>
                            <div className='inner-txt'>
                               <div className='title'>王狗冲</div> 
                               <div>雨量:<span className='inner'>*</span>&nbsp;mm</div>  
                            </div>
                            <div className='icon-img'><img src={flagRain} alt="" /></div>
                        </div>     
                        {/* 水位部分 */}
                        <div className='flow-item water-item'>
                            <div className='icon-img'><img src={flagWater} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>厂房站</div> 
                               <div>水位:<span className='inner'>*</span>&nbsp;m</div>   
                               <div>出库流量:<span className='outflow'>*</span>&nbsp;m³/s</div> 
                            </div>
                        </div>     
                        <div className='flow-item water-item'>
                            <div className='icon-img'><img src={flagWater} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>闸室站</div>  
                               <div>水位:<span className='inner'>*</span>&nbsp;m</div>  
                               <div>库容:<span className='kurong'>*</span>&nbsp;wm³</div>    
                            </div>
                        </div>     
                        <div className='flow-item water-item' style={{'display':'none'}}>
                            <div className='icon-img'><img src={flagWater} alt="" /></div>
                            <div className='inner-txt'>
                               <div className='title'>新泉站</div> 
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