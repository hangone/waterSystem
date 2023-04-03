import React,{useEffect,useState,useRef, Fragment} from 'react' ;
import { Spin  } from 'antd'; 
import { MessageTool,MessageToolClear } from 'Components/Tools/MessageTool'; 
import { getWaterMinute1,getWaterMinute2,getWaterMinute3, 
    getRainMinute1,getRainMinute2,getRainMinute3,getRainMinute4,getRainMinute5,
    getCapMinute1,getInflowMinute2,getOutflowMinute3 } from 'Services/Home/minute'; 
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
    // 时间列数据转换(时间)
    let columnsTimeList = [
        '08', '09',  '10',  '11', '12',
        '13', '14', '15', '16', '17', '18',
        '19', '20',  '21', '22', '23', '00',
        '01', '02', '03', '04', '05', '06', '07',
    ]
      
  
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

            // // 去除末尾的厂房站雨量
            // typeList2 = typeList2.slice(0,typeList2.length-1)
              
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

    // 验证分钟
    const verifyMinute = (one,two,mode)=>{ 
        if(one == '合计雨量') return true;

        let hour1 = parseInt(one.replace(' ','').slice(0,2))
        let minute1 = parseInt(one.replace(' ','').slice(3))
        let hour2 = parseInt(two.replace(' ','').slice(0,2))
        let minute2 = parseInt(two.replace(' ','').slice(3)) 
        if(mode == '>='){
            // 15:00       16:01; 
            if(hour1>hour2 || (hour1 == hour2 && minute1 >= minute2)){ 
                return true;
            } 
        }else if(mode == '<'){ 
            if(hour1<hour2 || (hour1 == hour2 && minute1 < minute2)){ 
                return true;
            }  
        }else if(mode == '<='){
            // 15:00       16:01; 
            if(hour1<hour2 || (hour1 == hour2 && minute1 <= minute2)){ 
                return true;
            } 
        }else if(mode == '>'){ 
            if(hour1>hour2 || (hour1 == hour2 && minute1 > minute2)){ 
                return true;
            }  
        }
        return false;
    }   // 15:40' '15:38' false false

    // 五、获取日数据
    const getDayData = async(isInit=false) =>{ 
        try{  
            let preTime = moment().format("HH:mm") ;

            // 入库流量，出库流量，库容
            let dayCap1 = await getCapMinute1() 
            let dayInflow2 = await getInflowMinute2() 
            let dayOutflow3 = await getOutflowMinute3()  
            // 水位
            let dayWater1 = await getWaterMinute1() 
            let dayWater2 = await getWaterMinute2()
            let dayWater3 = await getWaterMinute3() 
            // 雨量
            let dayRain1 = await getRainMinute1() 
            let dayRain2 = await getRainMinute2() 
            let dayRain3 = await getRainMinute3() 
            let dayRain4 = await getRainMinute4() 
            let dayRain5 = await getRainMinute5() 
 
            // 过滤数据
            var t_res = [] 
            const prefixDate = moment().format('YYYY-MM-DD ') 
            let nowTime = parseInt(moment().format("HH"))
            nowTime  = nowTime - 8
            if(nowTime<0) nowTime += 25 
            let t_max = 0; // 没有负值
            let t_min = 1000000; // 没有极大值 
    
            // // // 切割超出的时数据  
            // dayCap1 = stripDayUselessData2(dayCap1) 
    
            let timeTurns = 0;
            let curMinute = 0;
            let t_item = 0; 
            dayCap1.forEach((item,index)=>{ 
                // 表格数据  
                timeTurns = Math.floor(index / 12);
                curMinute = (index % 12 ) * 5;
                curMinute = curMinute <10  ? '0'+curMinute : curMinute 
    
                t_item = prefixDate +  columnsTimeList[timeTurns] + ':'+ curMinute + ':00' 
                t_res.push( { 
                    order:(index == nowTime ? '*' : '' )+(index+1),  
                    [typeList1[0].stcd+'rz']: changeDataLine(dayWater1[index]), 
                    [typeList1[1].stcd+'rz']: changeDataLine(dayWater2[index]), 
                    [typeList1[2].stcd+'rz']: changeDataLine(dayWater3[index]), 
    
                    [typeList2[0].stcd+'drp']: changeDataLine2(dayRain1[index]), 
                    [typeList2[1].stcd+'drp']: changeDataLine2(dayRain2[index]),  
                    [typeList2[2].stcd+'drp']: changeDataLine2(dayRain3[index]),  
                    [typeList2[3].stcd+'drp']: changeDataLine2(dayRain4[index]),  
                    [typeList2[4].stcd+'drp']: changeDataLine2(dayRain5[index]), 
    
                    [typeList1[0].stcd+'w']:changeDataLine(dayCap1[index] ), 
                    [typeList1[1].stcd+'inflow']:changeDataLine(dayInflow2[index]  ),
                    [typeList1[2].stcd+'outflow']:changeDataLine(dayOutflow3[index] ), 
                    
                    tm:  columnsTimeList[timeTurns] + ':'+ curMinute,
                })    
            })   

            
        // 切割数据
        let tt_res = []
        const currentDayTime = moment().format("HH")
        // const goalCurrentDayTime = moment().format("YYYY-MM-DD HH时") 
        const goalCurrentDayTime = moment().format("HH:mm") 
        let isNotArriveDay = true; 
        // map是可修改数据
        t_res.map((item,index)=>{ 
            if(isNotArriveDay){  
                // if(item.tm == goalCurrentDayTime|| item.tm == '*' + goalCurrentDayTime){
                //     isNotArriveDay = false;   2019-02-00 01:01:01
                // }    
                if(index!= 0 && index != t_res.length - 1 && verifyMinute(item.tm,goalCurrentDayTime,'<=')
                    && verifyMinute(t_res[index+1].tm,goalCurrentDayTime,'>')){
                    isNotArriveDay = false;  
                }
                tt_res.push(item);
            } 
        })   
        // 获取最后的数据
         
        let len = tt_res.length
        if(len){ 
            let dataObj = tt_res[len-1];  
            // 1.水位数据   
            // 闸室
            let w0 = changeDataLine(dataObj[typeList1[0].stcd+'rz']) 
            let a0 = document.querySelector('.flow-flag-div>div:nth-child(7) .inner-txt span.inner')
            setDomInnerText(a0,w0) 
            // 新泉站
            let w1 = changeDataLine(dataObj[typeList1[1].stcd+'rz'])  
            let a1 = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inner-water')
            setDomInnerText(a1,w1)
            // 厂房站
            let w2 = changeDataLine(dataObj[typeList1[2].stcd+'rz']) 
            let a2 = document.querySelector('.flow-flag-div>div:nth-child(6) .inner-txt span.inner')
            setDomInnerText(a2,w2)  
            
            // 2.雨量数据
             // 王狗冲
            let drp1 = changeDataLine2(dataObj[typeList2[0].stcd+'drp'])  
            let b1 = document.querySelector('.flow-flag-div>div:nth-child(5) .inner-txt span.inner')
            setDomInnerText(b1,drp1)
            // 老庵里
            let drp0 = changeDataLine2(dataObj[typeList2[1].stcd+'drp'])  
            let b0 = document.querySelector('.flow-flag-div>div:nth-child(3) .inner-txt span.inner')
            setDomInnerText(b0,drp0)
            // 新泉站
            let drp2 = changeDataLine2(dataObj[typeList2[2].stcd+'drp'])  
            let b2 = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inner')
            setDomInnerText(b2,drp2)
            // 西江口
            let drp3 = changeDataLine2(dataObj[typeList2[3].stcd+'drp'])  
            let b3 = document.querySelector('.flow-flag-div>div:nth-child(2) .inner-txt span.inner')
            setDomInnerText(b3,drp3)
            // 张佳坊
            let drp4 = changeDataLine2(dataObj[typeList2[4].stcd+'drp'])  
            let b4 = document.querySelector('.flow-flag-div>div:nth-child(1) .inner-txt span.inner')
            setDomInnerText(b4,drp4)

            // 3.获取库容，入库，出库数据 
            // 设置闸室库容
            let cap1 = changeDataLine(dataObj[typeList1[0].stcd+'w'])  
            let c1 = document.querySelector('.flow-flag-div>div:nth-child(7) .inner-txt span.kurong')
            setDomInnerText(c1,cap1)
            // 设置新泉入库流量
            let inflow1 = changeDataLine(dataObj[typeList1[1].stcd+'inflow'])  
            let c2 = document.querySelector('.flow-flag-div>div:nth-child(4) .inner-txt span.inflow')
            setDomInnerText(c2,inflow1) 
            // 设置厂房出库流量
            let outflow1 = changeDataLine(dataObj[typeList1[2].stcd+'outflow'])  
            let c3 = document.querySelector('.flow-flag-div>div:nth-child(6) .inner-txt span.outflow')
            setDomInnerText(c3,outflow1)
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