import React,{useEffect,useState,useRef, Fragment} from 'react' ;
import {  Button,Menu, Dropdown  ,Table,Radio,Spin  } from 'antd'; 
import { MessageTool,MessageToolClear } from 'Components/Tools/MessageTool'; 
import { getWaterChangeDay,getWaterChangeWeek,getWaterChangeMonth,
    getCapChangeDay,getInflowChangeDay,getOutflowChangeDay } from 'Services/Home'; 
import { changeDataLine,reverseFormatDate,dateSort,
    stripDayUselessData,stripMonthUselessData,
    getDatetimeList,reverseFormatDate2} from 'Utils'
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
 

function WaterChange(){    
    // 端点编码
    let typeList  = []  
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
    const [isTableCollapse,setIsTableCollapse] = useState( sessionStorage.getItem("water_isTableCollapse")  == 'true'  ? true : false)

    // 用于初始化的标志位
    let isLeftOk =  false 
    let isCenterOk = false 
    let isRightOk = false

    
    // 刻度数据(y轴的刻度,series的颜色)
    let myAxisObj = {
        'yAxis':{ 
            'day':{min:0, max:250},
            'week':{min:0, max:250},
            'month':{min:0, max:250},
            'avg':5
        },
        'series':{ 
            'day':[
                {
                    itemStyle:{ 
                        // 常量颜色 c1
                        normal:{ color: Common.colorChartArr.c1 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c1  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c2
                        normal:{ color: Common.colorChartArr.c2 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c2  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c3
                        normal:{ color: Common.colorChartArr.c3 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c3  } 
                    },
                }
            ],
            'week':[
                {
                    itemStyle:{ 
                        // 常量颜色 c1
                        normal:{ color: Common.colorChartArr.c1 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c1  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c2
                        normal:{ color: Common.colorChartArr.c2 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c2  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c3
                        normal:{ color: Common.colorChartArr.c3 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c3  } 
                    },
                }
            ],
            'month':[
                {
                    itemStyle:{ 
                        // 常量颜色 c1
                        normal:{ color: Common.colorChartArr.c1} 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c1  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c2
                        normal:{ color: Common.colorChartArr.c2 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c2  } 
                    },
                },
                {
                    itemStyle:{ 
                        // 常量颜色 c3
                        normal:{ color: Common.colorChartArr.c3 } 
                    }, 
                    lineStyle:{ 
                        normal:{width:1, color: Common.colorChartArr.c3  } 
                    },
                }
            ],
        }
    }
    // 时间列数据转换(时间)
    let columnsTimeList = [
        ' 08时', ' 09时',  ' 10时',  ' 11时', ' 12时',
        ' 13时', ' 14时', ' 15时', ' 16时', ' 17时', ' 18时',
        ' 19时', ' 20时',  ' 21时', ' 22时', ' 23时', ' 00时',
        ' 01时', ' 02时', ' 03时', ' 04时', ' 05时', ' 06时', ' 07时',
    ]
    // 图表默认数据(series数据)
    let defaultObj = { 
        // type: 'bar',
        type: 'line',
        // markPoint: {
        //     data: [
        //       { type: 'max', name: 'Max' },
        //       { type: 'min', name: 'Min' }
        //     ]
        // }, 
        smooth: true,
        emphasis: {
            focus: 'series'
        },
        
        itemStyle:{ 
            normal:{ color: "rgb(146, 53, 53)" } 
        }, 
        lineStyle:{ 
            normal:{width:1, color: "rgb(146, 53, 53)"  } 
        }, 
        // 线条阴影
        // areaStyle: {
        //     normal: {
        //       color: {
        //         x: 0,
        //         y: 0,
        //         x2: 0,
        //         y2: 1,
        //         colorStops: [{
        //             offset: 0,
        //             color: "#dc3881" // 0% 处的颜色
        //           }, {
        //             offset: 0.7,
        //             color: "rgba(20,56,129,0)" // 100% 处的颜色
        //            }],
        //             globalCoord: false // 缺省为 false
        //           }
        //         }
        //   },
    }
    // 表格行、列数据（表头）
    const [columns,setColumns] = useState()  
    // 表格行、列数据 （表体）
    const [dataSource,setDataSource] = useState([])  
    // // 图表x轴、y轴数据（表头, 数据传递不及时 ）
    // const [echartNamesList,setEchartNamesList] = useState([])
    // // 图表x轴、y轴数据（数据传递不及时 ）
    // const [echartList,setEchartList] = useState({
    //     xArr:[],
    //     yArr:[]
    // })
  
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
            typeList  = Common.waterData 
  
            // 首次查询表格数据, 月、 周、日   
            onSearch('month',true);  
            onSearch('week',true);  
            onSearch('day',true);  
            ITimer = setInterval(()=>{ 
                // 查询表格数据
                hideCharts()
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
        window.addEventListener("resize", function() { 
            // 重新设置表头宽度   
            resetTableTitleWidth()  
 
            // 重新设置图的宽高
            if(myChartTop) myChartTop.resize()
            if(myChartMiddle) myChartMiddle.resize()
            if(myChartBottom) myChartBottom.resize() 
        });  
        // document.querySelector(".bottom-bottom").addEventListener("click", function() { 
        //     if(myChartTop) myChartTop.resize()
        //     if(myChartMiddle) myChartMiddle.resize()
        //     if(myChartBottom) myChartBottom.resize() 
        // });  
        return () => {
            window.removeEventListener("resize",()=>{});
            // document.querySelector(".bottom-bottom").removeEventListener("click",()=>{});
            if(myChartTop) myChartTop.dispose()
            if(myChartMiddle) myChartMiddle.dispose()
            if(myChartBottom) myChartBottom.dispose() 
        };
    }, [window]); 
    // 监听PubSub.subscribe 的变化
    useEffect(()=>{ 
        PubSub.subscribe("water_titleMenu",(msg,stateObj)=>{ 
            if(stateObj && Object.keys(stateObj)){ 
                const show =  stateObj.isShowTitle 
                setIsShowTitle(show)
                sessionStorage.setItem("water_isShowTitle",show)
            }
        })  
        PubSub.subscribe("water_leftcollapsed",(msg,stateObj)=>{    
            // 修改表格的宽度
            resetTableTitleWidth()

            let parentNode1 = document.querySelector("#bottom-echart-top")
            let childrenNode1 = document.querySelector("#bottom-echart-top>div")
            let canvasNode1 = document.querySelector("#bottom-echart-top>div canvas")
            parentNode1.style.cssText = "width:33.3%!important;height:100%!important"; 
            childrenNode1.style.cssText = "width:100%!important;height:100%!important;display:flex!important;justify-content:center";  
            canvasNode1.style.cssText = "width:100%!important;height:96%!important;z-index:999"; 
            if(myChartTopRes) myChartTopRes.resize() 
                    
            let parentNode2 = document.querySelector("#bottom-echart-bottom")
            let childrenNode2 = document.querySelector("#bottom-echart-bottom>div")
            let canvasNode2 = document.querySelector("#bottom-echart-bottom>div canvas")
            parentNode2.style.cssText = "width:33.3%!important;height:100%!important"; 
            childrenNode2.style.cssText = "width:100%!important;height:100%!important;display:flex!important;justify-content:center";  
            canvasNode2.style.cssText = "width:100%!important;height:96%!important;z-index:999";  
            if(myChartBottomRes) myChartBottomRes.resize()  
                
            let parentNode3 = document.querySelector("#bottom-echart-middle")
            let childrenNode3 = document.querySelector("#bottom-echart-middle>div")
            let canvasNode3 = document.querySelector("#bottom-echart-middle>div canvas")
            parentNode3.style.cssText = "width:33.3%!important;height:100%!important"; 
            childrenNode3.style.cssText = "width:100%!important;height:100%!important;display:flex!important;justify-content:center";  
            canvasNode3.style.cssText = "width:100%!important;height:96%!important;z-index:999";  
            if(myChartMiddleRes) myChartMiddleRes.resize()  

            setMyChartTopRes(myChartTopRes)
            setMyChartMiddleRes(myChartMiddleRes)
            setMyChartBottomRes(myChartBottomRes) 
        })   
        return ()=>{
            PubSub.unsubscribe("water_titleMenu")
            PubSub.unsubscribe("water_leftcollapsed")
        }
    },[PubSub.subscrib ])
    // 监听图的显示
    useEffect(()=>{ 
        if(echartTopNodeRef.current){ 
            echartTopNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";  
        }  
        if(echartMiddleNodeRef.current){ 
            echartMiddleNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important"; 
        } 
        if(echartBottomNodeRef.current){ 
            echartBottomNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important"; 
        }   

        // // 再次修正位置   
        if(myChartTop) myChartTop.resize()
        if(myChartMiddle) myChartMiddle.resize()
        if(myChartBottom) myChartBottom.resize() 
    },[isShowEchart]) 
     // 监听时间的变化
     useEffect(()=>{ 
        dragTableScroll();
    },[moment().format("HH"),dataSource]) 

    // 三、功能操作
    // 主动滚动当前滚动条, 传递目标时间
    const dragTableScroll = () =>{
        // 目标滚动容器
        var goalNode = document.querySelector('.bottom-top');
        if(!goalNode){
            console.log("错误！当前无法自动滚动！")
            return;
        }
        // 当前的滚动减少的行数
        var declineRow = 3;
        // 通过比较当前的时间，来拖动滚动条。
        var totalRow = dataSource.length; 
        // 计算滚动的比例
        let turnsRow = 0;
        switch(radioItem){
            case 'day':
                const currentDayTime = moment().format("HH")
                const goalCurrentDayTime = moment().format("YYYY-MM-DD HH时") 
                let isNotArriveDay = true;
                // map是可修改数据
                dataSource.map(item=>{ 
                    if(isNotArriveDay){ 
                        turnsRow ++;
                        if(item.tm == goalCurrentDayTime|| item.tm == '*' + goalCurrentDayTime){
                            isNotArriveDay = false; 
                        }
                    } 
                })  
                break;
            case 'week': 
                const currentWeekTime = moment().format("ddd")
                const goalCurrentWeekTime = moment().format("ddd") 
                let isNotArriveWeek = true;
                // map是可修改数据
                dataSource.map(item=>{ 
                    if(isNotArriveWeek){ 
                        turnsRow ++;
                        if(item.tm == goalCurrentWeekTime || item.tm == '*' + goalCurrentWeekTime){
                            isNotArriveWeek = false; 
                        }
                    } 
                })  
                break;
            case 'month':
                const currentMonthTime = moment().format("HH")
                const goalCurrentMonthTime = currentMonthTime + '日' 
                let isNotArriveMonth = true;
                // map是可修改数据
                dataSource.map(item=>{ 
                    if(isNotArriveMonth){ 
                        turnsRow ++;
                        if(item.tm == goalCurrentMonthTime || item.tm == '*' + goalCurrentMonthTime){
                            isNotArriveMonth = false; 
                        }
                    } 
                })  
                break;
        }
        // 按照比例拖动滚动条
        turnsRow -= declineRow
        turnsRow = turnsRow > 0 ? turnsRow : 0
        goalNode.scrollTop = goalNode.scrollHeight * turnsRow / totalRow
    }
    // 搜索表格信息,(先获取远程数据，再绘制表格)
    const onSearch = (t_radioItem=null,isInit = false)=>{    
        switch(t_radioItem){
            case 'day':
                getDayData(isInit);
                break; 
            case 'week':
                getWeekData(isInit);
                break; 
            case 'month':
                getMonthData(isInit);
                break; 
        }
    }
    // 切换表格显示信息 
    const onChange = (e) => {
        setIsLoading(true)
        setRadioItem(e.target.value); 
        // 重新设置一下数据
        typeList = Common.waterData;
        onSearch(e.target.value);
        // 清空原定时器，启动新的定时器 
        let ITimerResponse = sessionStorage.getItem("ITimerResponse")
        if(ITimerResponse)  clearInterval(ITimerResponse) 
        if(ITimer)  clearInterval(ITimer) 
        ITimer = setInterval(()=>{  
            hideCharts()
            onSearch(e.target.value); 
            MessageTool("数据已经更新","success")
        },Common.refreshDelay) 
        sessionStorage.setItem('ITimerResponse',ITimer) 
        // 关闭旋转器
        // setTimeout(()=>{ 
        //     setIsLoading(false)
        // },1000)
 
    };
 
    // 五、获取远程数据
    // 获取日数据
    const getDayData = async(isInit=false) =>{ 
        // 入库流量，出库流量，库容
        let day1 = await getCapChangeDay() 
        let day2 = await getInflowChangeDay() 
        let day3 = await getOutflowChangeDay() 

        // 判断结果是否为空
        if(!day1.data || !day2.data || !day3.data){
            MessageTool("数据为空",'warning')
            return;
        }

        // 获取列表数据  
        let dayData1 = dateSort(Object.keys(day1.data)).map(item=>{
            return day1.data[item]
        })
        let dayData2 = dateSort(Object.keys(day2.data)).map(item=>{
            return day2.data[item]
        })
        let dayData3 = dateSort(Object.keys(day3.data)).map(item=>{
            return day3.data[item]
        })
 
        getWaterChangeDay().then(res=>{
            // console.log("getWaterChangeDay返回的数据day是",res) 

            let t_columns = [ 
                {
                    title: '时间(时)',
                    dataIndex:'tm',
                    key:'tm',
                    align:'center',
                    width:150,
                    // fixed: 'left',
                },
            ] 
            typeList.forEach((item,index)=>{  
                t_columns.push({
                    title:item.stnm + '(米)',
                    dataIndex:item.stcd+'rz',
                    key:item.stcd+'rz',
                    align:'center',
                    width:80,
                })
                // 间隔加入
                switch(index){
                    case 0: 
                        t_columns.push({
                            title: '库容(万立方米)',
                            dataIndex:typeList[0].stcd+'w',
                            key:typeList[0].stcd+'w',
                            align:'center',
                            width:120,
                        }) 
                        break;
                    case 1: 
                        t_columns.push({
                            title:'入库流量(立方米/秒)',
                            dataIndex:typeList[1].stcd+'inflow',
                            key:typeList[1].stcd+'inflow',
                            align:'center',
                            width:120,
                        }) 
                        break;
                    case 2:       
                        t_columns.push({
                            title:'出库流量(立方米/秒)',
                            dataIndex:typeList[2].stcd+'outflow',
                            key:typeList[2].stcd+'outflow',
                            align:'center',
                            width:120,
                        }) 
                        break;
                }
            }) 

            setColumns(t_columns) 

 
            // // （1.获取图表数据
            var t_res = []
            let t_echartsX = [];
            let t_echartsY = []; 
            const t_subData0 = [];
            const t_subData1 = [];
            const t_subData2 = [];
            const prefixDate = formatDate(new Date(),'yyyy-MM-dd') 
            let nowTime = parseInt(moment().format("HH"))
            nowTime  = nowTime - 8
            if(nowTime<0) nowTime += 25 
            let t_max = 0; // 没有负值
            let t_min = 1000000; // 没有极大值 
  
            // 切割超出的时数据  
            res = stripDayUselessData(res)

            // 获取当前的时间列表
            let datetimeList = getDatetimeList() 

            res.forEach((item,index)=>{ 
                // 表格数据  
                t_res.push( { 
                    order:(index == nowTime ? '*' : '' )+(index+1),  
                    [item[0].stcd]:item[0].stcd,
                    [item[0].stcd+'rz']: changeDataLine(item[0].rz),  
                    [item[1].stcd]:item[1].stcd,
                    [item[1].stcd+'rz']: changeDataLine(item[1].rz), 
                    [item[2].stcd]:item[2].stcd,
                    [item[2].stcd+'rz']: changeDataLine(item[2].rz), 
 
                    [typeList[0].stcd+'w']:changeDataLine(dayData1[index] ), 
                    [typeList[1].stcd+'inflow']:changeDataLine(dayData2[index] ),
                    [typeList[2].stcd+'outflow']:changeDataLine(dayData3[index]), 
 
                    // tm:  prefixDate + columnsTimeList[index]  ,
                    tm:  reverseFormatDate2(datetimeList[index]) ,
                }) 
                // 图表数据
                t_echartsX.push((index  == nowTime ? '*' : '' )+columnsTimeList[index])
                t_subData0.push(changeDataLine(item[0].rz )) 
                t_subData1.push(changeDataLine(item[1].rz )) 
                t_subData2.push(changeDataLine(item[2].rz )) 
                // 计算最大值和最小值
                if(item[0].rz ||  item[0].rz == 0){
                    if(item[0].rz > t_max){
                        t_max = parseInt(item[0].rz)
                    }
                    if(item[0].rz < t_min){
                        t_min = item[0].rz 
                    }
                }
                if(item[1].rz ||  item[1].rz == 0){
                    if(item[1].rz > t_max){
                        t_max = parseInt(item[1].rz)
                    }
                    if(item[1].rz < t_min){
                        t_min = item[1].rz 
                    }
                }
                if(item[2].rz ||  item[2].rz == 0){
                    if(item[2].rz > t_max){
                        t_max = parseInt(item[2].rz)
                    }
                    if(item[2].rz < t_min){
                        t_min = item[2].rz 
                    }
                }
            })  
            setDataSource(t_res)  
 
            // 填补图的空数据（表格不填充） 日数据
            let hasLen = t_subData0.length
            let moreNullDataLen = 23 - hasLen;

            if(moreNullDataLen>0){ 
                while(moreNullDataLen--){
                    hasLen ++ ;
                    t_echartsX.push(columnsTimeList[hasLen])
                    t_subData0.push(null)  
                    t_subData1.push(null) 
                    t_subData2.push(null)  
                }
            }


            // (2.计算日数据的最大值 与最小值，确认刻度的区间。
            // if(t_min < 0) t_min = 0  // 可能存放负值
            if(t_max < t_min){
                t_max = 250;
                t_min = 0
            } 
            let realAvg = 0
            if((t_max - t_min )  / 10 > myAxisObj.yAxis.avg  || t_max == t_min ){
                realAvg  = myAxisObj.yAxis.avg  
            }else{ 
                realAvg  = (t_max - t_min )  / 10 
            }
            if(realAvg < 0) realAvg = myAxisObj.yAxis.avg // 可能存放负值
           
            t_max = Math.ceil(t_max + realAvg )
            t_min = Math.floor(t_min - realAvg )
            
            // if(t_min < 0) t_min = 0  // 可能存放负值
            myAxisObj = {
                ...myAxisObj,
                'yAxis':{
                    ...myAxisObj.yAxis,
                    'day':{min:t_min, max:t_max}
                }
            } 
   
            // // （3.绘制表格.
            // // 日数据表格
            t_echartsY  = [{
                ...defaultObj,
                name:typeList[0].stnm,
                data:t_subData0,
                ...myAxisObj.series.day[0]
            },{
                ...defaultObj,
                name:typeList[1].stnm,
                data:t_subData1,
                ...myAxisObj.series.day[1]
            },{
                ...defaultObj,
                name:typeList[2].stnm,
                data:t_subData2,
                ...myAxisObj.series.day[2]
            }]  
            drawContentRightTop({
                xArr:t_echartsX,
                yArr:t_echartsY
            })

            // 暂停旋转器
            isLeftOk = true
            showCharts()

            // 重新设置表头宽度
            setTimeout(()=>{ 
                resetTableTitleWidth()
            },1000)
        }).catch(err=>{ 

            
            // 暂停旋转器
            setIsLoading(false)  
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        })
    } 
    // 获取周数据
    const getWeekData = (isInit=false) =>{  
        getWaterChangeWeek().then(res=>{ 
            // console.log("getWaterChangeWeek返回的数据month是",res)   

            // （0.重新获取表头数据
            let t_columns = [ 
                {
                    title:'日期(日)',
                    dataIndex:'tm',
                    key:'tm',
                    align:'center',
                    width:150,
                    // fixed: 'left',
                },
            ] 
            typeList.forEach(item=>{  
                t_columns.push({
                    title:item.stnm + '(米)',
                    dataIndex:item.stcd+'rz',
                    key:item.stcd+'rz',
                    align:'center',
                    width:80,
                })
            }) 


 
            // // // （1.获取图表数据
            var t_res = []
            let t_echartsX = [];
            let t_echartsY = []; 
            const t_subData0 = [];
            const t_subData1 = [];
            const t_subData2 = [];
            // const prefixDate = formatDate(new Date(),'yyyy-MM-dd')
            const prefixDate = ''
            // 方案一：获取当前月的数据
            const start = parseInt(moment().format("e")) 
            const todayDay =  parseInt(moment().format("D")) 
            // 方案二：获取上一个月的数据
            let dateLen = res.length;

            let t_max = 0; // 没有负值
            let t_min = 1000000; // 没有极大值
            let turns = 0;
            const turnsList = ['一','二','三','四','五','六','日']

            //  月份初期,填补周数据
            let declineDay = start - todayDay + 1; 
            if(todayDay < 7 && declineDay > 0){ 
                while(declineDay--){ 
                    turns += 1;
                    // 表格数据  
                    t_res.push( { 
                        tm: '周'+turnsList[turns-1],
                        // tm:reverseFormatDate(newTime), 
                        [typeList[0].stcd]:typeList[0].stcd,
                        [typeList[0].stcd+'rz']:'-', 
                        [typeList[1].stcd]:typeList[1].stcd,
                        [typeList[1].stcd+'rz']:'-', 
                        [typeList[2].stcd]:typeList[2].stcd,
                        [typeList[2].stcd+'rz']:'-', 
                    }) 
                    // 图表数据
                    t_echartsX.push('周'+turnsList[turns-1])

                    t_subData0.push(null) 
                    t_subData1.push(null) 
                    t_subData2.push(null) 
                }
            }
 
            // 切割超出的数据（每月的日数据）
            res = stripMonthUselessData(res)

            res.some((item,index)=>{  
                // （1.方案一
                if(todayDay - start <= index + 1 && turns < 7 ){ 
                    turns += 1;
 
                // （2.方案二
                // 获取前31日的日期
                // let newTime =  moment().subtract(dateLen,'day').format("YYYY-MM-DD");
                // dateLen -= 1
                // if(dateLen < 7){ 
 
                    // 表格数据  
                    t_res.push( { 
                        tm: (turns-1 == start ? '*' : '' )+'周'+turnsList[turns-1],
                        // tm:reverseFormatDate(newTime),
                        // sttp:item[0].sttp == 'RR' ? '水库水文站' :'-',
                        [item[0].stcd]:item[0].stcd,
                        [item[0].stcd+'rz']:changeDataLine(item[0].rz), 
                        [item[1].stcd]:item[1].stcd,
                        [item[1].stcd+'rz']:changeDataLine(item[1].rz), 
                        [item[2].stcd]:item[2].stcd,
                        [item[2].stcd+'rz']:changeDataLine(item[2].rz), 
                    }) 
                    // 图表数据
                    t_echartsX.push((turns-1 == start ? '*' : '' )+'周'+turnsList[turns-1])
                    // t_echartsX.push(newTime)

                    t_subData0.push(changeDataLine(item[0].rz )) 
                    t_subData1.push(changeDataLine(item[1].rz )) 
                    t_subData2.push(changeDataLine(item[2].rz )) 
                    // 计算最大值和最小值
                        
                    if(item[0].rz ||  item[0].rz == 0){
                        if(item[0].rz > t_max){
                            t_max = parseInt(item[0].rz)
                        }
                        if(item[0].rz < t_min){
                            t_min = item[0].rz 
                        }
                    }
                    if(item[1].rz ||  item[1].rz == 0){
                        if(item[1].rz > t_max){
                            t_max = parseInt(item[1].rz)
                        }
                        if(item[1].rz < t_min){
                            t_min = item[1].rz 
                        }
                    }
                    if(item[2].rz ||  item[2].rz == 0){
                        if(item[2].rz > t_max){
                            t_max = parseInt(item[2].rz)
                        }
                        if(item[2].rz < t_min){
                            t_min = item[2].rz 
                        }
                    }
                } 
            }) 

            // 填补图的空数据（表格不填充） 周数据
            let hasLen = t_subData0.length
            let moreNullDataLen = 7 - hasLen;
            while(moreNullDataLen--){
                hasLen ++ ;
                t_echartsX.push('周'+turnsList[hasLen-1])
                t_subData0.push(null)  
                t_subData1.push(null) 
                t_subData2.push(null)  
            } 

            // 首次加载时不抢占位置  
            if(!isInit){
                setColumns(t_columns)  
                setDataSource(t_res)   
            }

            // // (2.计算日数据的最大值 与最小值，确认刻度的区间。
            // if(t_min < 0) t_min = 0  // 可能存放负值
            if(t_max < t_min){
                t_max = 250;
                t_min = 0
            } 
            let realAvg = 0
            if((t_max - t_min )  / 10 > myAxisObj.yAxis.avg  || t_max == t_min  ){
                realAvg  = myAxisObj.yAxis.avg  
            }else{ 
                realAvg  = (t_max - t_min )  / 10 
            }
            
            if(realAvg < 0) realAvg = myAxisObj.yAxis.avg // 可能存放负值

            t_max = Math.ceil(t_max + realAvg )
            t_min = Math.floor(t_min - realAvg )
            
            // if(t_min < 0) t_min = 0  // 可能存放负值
            myAxisObj = {
                ...myAxisObj,
                'yAxis':{
                    ...myAxisObj.yAxis,
                    'week':{min:t_min, max:t_max}
                }
            }
   
            // // （3.绘制表格.
            // // 日数据表格
            t_echartsY  = [{
                ...defaultObj,
                name:typeList[0].stnm,
                data:t_subData0,
                ...myAxisObj.series.week[0]
            },{
                ...defaultObj,
                name:typeList[1].stnm,
                data:t_subData1,
                ...myAxisObj.series.week[1]
            },{
                ...defaultObj,
                name:typeList[2].stnm,
                data:t_subData2,
                ...myAxisObj.series.week[2]
            }]  
            drawContentRightMiddle({
                xArr:t_echartsX,
                yArr:t_echartsY
            }) 
            
            // 暂停旋转器
            // setIsLoading(false) 
            isCenterOk = true
            if(isInit == false){
                showCharts()
            } 
            
            // 重新设置表头宽度
            setTimeout(()=>{ 
                resetTableTitleWidth()
            },1000)
        }).catch(err=>{ 
            
            // 暂停旋转器
            setIsLoading(false)  
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        }) 
    }
    // 获取月数据
    const getMonthData = (isInit=false) =>{  
        getWaterChangeMonth().then(res=>{
            // console.log("getWaterChangeMonth返回的数据month是",res)   
            // （0.重新获取表头数据
            let t_columns = [ 
                {
                    title:formatDate(new Date(),'MM')+'月份(日)',
                    dataIndex:'tm',
                    key:'tm',
                    align:'center',
                    width:150,
                    // fixed: 'left',
                },
            ] 
            typeList.forEach(item=>{  
                t_columns.push({
                    title:item.stnm + '(米)',
                    dataIndex:item.stcd+'rz',
                    key:item.stcd+'rz',
                    align:'center',
                    width:80,
                })
            })  

 
            // // （1.获取图表数据
            var t_res = []
            let t_echartsX = [];
            let t_echartsY = []; 
            const t_subData0 = [];
            const t_subData1 = [];
            const t_subData2 = [];
            // 方案一：获取当前月的数据 
            const prefixDate = formatDate(new Date(),'yyyy-MM-')
            // const prefixDate = ''

            // 方案二：获取上一个月的数据
            const nowTime = parseInt(moment().format("DD")) 
            let dateLen = res.length;
 
            let t_max = 0; // 没有负值
            let t_min = 1000000; // 没有极大值
            
            
            // 切割超出的数据（每月的日数据）
            res = stripMonthUselessData(res)

            res.forEach((item,index)=>{ 
                // (1.方案一
                
                let t = index  + 1;
                let t_tm = prefixDate+(t < 10 ? '0'+ t : t)

                // （2.方案二
                // 表格数据  
                // 获取前31日的日期
                // let newTime =  moment().subtract(dateLen,'day').format("YYYY-MM-DD");
                // dateLen -= 1


                t_res.push( { 
                    tm:(index + 1 == nowTime ? '*' : '' )+reverseFormatDate(t_tm),
                    // tm:reverseFormatDate(newTime),
                    // sttp:item[0].sttp == 'RR' ? '水库水文站' :'-',
                    [item[0].stcd]:item[0].stcd,
                    [item[0].stcd+'rz']:changeDataLine(item[0].rz), 
                    [item[1].stcd]:item[1].stcd,
                    [item[1].stcd+'rz']:changeDataLine(item[1].rz), 
                    [item[2].stcd]:item[2].stcd,
                    [item[2].stcd+'rz']:changeDataLine(item[2].rz), 
                }) 
                // 图表数据 
                t_echartsX.push((index + 1 == nowTime ? '*' : '' )+t_tm)
                // t_echartsX.push(newTime)

                t_subData0.push(changeDataLine(item[0].rz )) 
                t_subData1.push(changeDataLine(item[1].rz )) 
                t_subData2.push(changeDataLine(item[2].rz )) 
                // 计算最大值和最小值
                if(item[0].rz ||  item[0].rz == 0){
                    if(item[0].rz > t_max){
                        t_max = parseInt(item[0].rz)
                    }
                    if(item[0].rz < t_min){
                        t_min = item[0].rz 
                    }
                }
                if(item[1].rz ||  item[1].rz == 0){
                    if(item[1].rz > t_max){
                        t_max = parseInt(item[1].rz)
                    }
                    if(item[1].rz < t_min){
                        t_min = item[1].rz 
                    }
                }
                if(item[2].rz ||  item[2].rz == 0){
                    if(item[2].rz && item[2].rz > t_max){
                        t_max = parseInt(item[2].rz)
                    }
                    if(item[2].rz < t_min){
                        t_min = item[2].rz 
                    }
                }
            }) 
            
            // 填补图的空数据（表格不填充） 周数据
            let hasLen = t_subData0.length
            let monthLen = parseInt(moment(moment().format('"YYYY-MM"'), "YYYY-MM").daysInMonth());  
            let moreNullDataLen = monthLen - hasLen; 

            while(moreNullDataLen--){
                hasLen ++ ;

                let t = hasLen ;
                let t_tm = prefixDate+(t < 10 ? '0'+ t : t)
                t_echartsX.push(t_tm)
                t_subData0.push(null)  
                t_subData1.push(null) 
                t_subData2.push(null)  
            }  


            // 首次加载时不抢占位置  
            if(!isInit){
                setColumns(t_columns)  
                setDataSource(t_res)   
            }

            // (2.计算日数据的最大值 与最小值，确认刻度的区间。
            // if(t_min < 0) t_min = 0 // 可能存放负值
            if(t_max < t_min){
                t_max = 250;
                t_min = 0
            } 
            let realAvg = 0
            if((t_max - t_min )  / 10 > myAxisObj.yAxis.avg  || t_max == t_min ){
                realAvg  = myAxisObj.yAxis.avg  
            }else{ 
                realAvg  = (t_max - t_min )  / 10 
            }
            if(realAvg < 0) realAvg = myAxisObj.yAxis.avg // 可能存放负值
            
            t_max = Math.ceil(t_max + realAvg )
            t_min = Math.floor(t_min - realAvg )
            
            // if(t_min < 0) t_min = 0   // 可能存放负值
            myAxisObj = {
                ...myAxisObj,
                'yAxis':{
                    ...myAxisObj.yAxis,
                    'month':{min:t_min, max:t_max}
                }
            }
   
            // // （3.绘制表格.
            // // 日数据表格
            t_echartsY  = [{
                ...defaultObj,
                name:typeList[0].stnm,
                data:t_subData0,
                ...myAxisObj.series.month[0]
            },{
                ...defaultObj,
                name:typeList[1].stnm,
                data:t_subData1,
                ...myAxisObj.series.month[1]
            },{
                ...defaultObj,
                name:typeList[2].stnm,
                data:t_subData2,
                ...myAxisObj.series.month[2]
            }]  
            drawContentRightBottom({
                xArr:t_echartsX,
                yArr:t_echartsY
            }) 
            
            // 暂停旋转器
            // setIsLoading(false)  
            isRightOk  = true
            if(isInit == false){
                showCharts()
            } 
            
            // 重新设置表头宽度
            setTimeout(()=>{ 
                resetTableTitleWidth()
            },1000)
        }).catch(err=>{ 
            // 暂停旋转器
            setIsLoading(false)  
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        })
    }
    
    // 六、图表显示
    // 显示的图表，顶部
    const drawContentRightTop = (t_echartList ) =>{   
        // 1.基于准备好的dom，初始化echarts实例
        // 清除已经生成的页面节点 
        let parentNodes = document.querySelector('#bottom-echart-top'); 
        parentNodes.innerHTML = ""
        // 清除原来的实例（但这里没有实际效果）
        if (myChartTop)  myChartTop = null;  
        // 删除原来的实例属性（或者设置为空也行）
        if(parentNodes.hasAttributes("_echarts_instance_"))  parentNodes.removeAttribute("_echarts_instance_")    
        // 注销后，重新创建实例
        myChartTop = echarts.init(document.getElementById('bottom-echart-top'),'dark');
           
        // 2.指定图表的配置项和数据
        var option = {
            title: {
                text: '日水位变化曲线', 
                color:'white',
                x:'center',
                y: 'bottom',
            },
            tooltip: {  
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                }
            },
            legend: {
                top:5,
                left:5,
                data:[typeList[0].stnm,typeList[1].stnm,typeList[2].stnm]
            },
            grid: {
                top: 70,
                bottom: 50
            },
            toolbox: { 
                show: true,
                orient: 'horizontal',    
                right: 10,
                top: 10,  
                feature: {  
                    magicType: {            //动态类型切换
                        show: true,           //是否显示该工具
                        type: ['line', 'bar'], //启用的动态类型
                        title:{
                            line:'折线图',    // 名称
                            bar:'柱状图'
                        }
                    }, 
                    saveAsImage: { show: true , title:'下载',} 
                }
            
            }, 
            xAxis: [
                    { 
                        type: 'category', 
                        position:'bottom',
                        name: '时间',
                        min: 0,   // 起始值
                        max: 23,  // 结束值  
                        nameTextStyle:{   // name标签文字样式
                            padding:[0,0,0,-10],  
                        },
                        data: t_echartList.xArr, 
                        axisTick: {      // 轴线刻度  
                            length: 7,//刻度线的长度
                            interval: 3,  //该{}中的data全部显示
                            lineStyle: { 
                                color: '#ccc',
                                fontSize: '20px'
                            }
                        },
                        axisLine: {       // 轴线颜色 
                            onZero: false,             // 保持轴线在底部， 非0位置
                            symbol:["none","arrow"],    //轴线箭头
                            symbolSize: [8, 10] 
                        },
                        boundaryGap: false       // 不留白，从原点开始
                    },
                    {  
                        type: 'category', 
                        position:'bottom',
                        min: 0,   // 起始值
                        max: 23,  // 结束值  
                        nameTextStyle:{   // name标签文字样式
                            padding:[0,0,0,-10],  
                        },
                        data: t_echartList.xArr, 
                        axisTick: {      // 轴线刻度  
                            length: 3,//刻度线的长度
                            interval: 0,  //该{}中的data全部显示
                            lineStyle: { 
                                color: '#ccc',
                                fontSize: '20px'
                            }
                        },
                        axisLine: {       // 轴线颜色 
                            onZero: false,             // 保持轴线在底部， 非0位置
                            symbol:["none","arrow"],    //轴线箭头
                            symbolSize: [8, 10] 
                        },
                        boundaryGap: false       // 不留白，从原点开始
                    }
            ],
            yAxis:  {
                type: 'value',
                name: '水位(米)', 
                min: 238,
                max: 230, 
                // 替换y轴刻度的最大值和最小值
                ...myAxisObj.yAxis.day, 
                axisLabel: {      // 纵轴刻度标签 
                    formatter: '{value}',  //  轴线标签
                    align: 'right'    // 轴线相对标签的位置
                }, 
	            boundaryGap: false       // 不留白，从原点开始
            },
            series: t_echartList.yArr
        };   
        // 3.使用刚指定的配置项和数据显示图表。
        myChartTop.setOption(option); 
        setMyChartTopRes(myChartTop)

        // 4.修正位置 
        if(echartTopNodeRef.current) echartTopNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";
        // 再次修正位置  
        if(myChartTop) myChartTop.resize()
        if(myChartMiddle) myChartMiddle.resize()
        if(myChartBottom) myChartBottom.resize() 
        // 显示图表，vue中采用v-show
        setTimeout(()=>{ 
            setIsShowEchart(true);
        },1000)
    }
    // 显示的图表，中部
    const drawContentRightMiddle = (t_echartList ) =>{    
        // 1.基于准备好的dom，初始化echarts实例
        // 清除已经生成的页面节点 
        let parentNodes = document.querySelector('#bottom-echart-middle'); 
        parentNodes.innerHTML = ""
        // 清除原来的实例（但这里没有实际效果）
        if (myChartMiddle)  myChartMiddle = null;  
        // 删除原来的实例属性（或者设置为空也行）
        if(parentNodes.hasAttributes("_echarts_instance_"))  parentNodes.removeAttribute("_echarts_instance_")    
        // 注销后，重新创建实例
        myChartMiddle = echarts.init(document.getElementById('bottom-echart-middle'),'dark');
       

        // 2.指定图表的配置项和数据
        var option = {
            title: {
                text: '周水位变化曲线', 
                x:'center',
                y: 'bottom',
            },
            tooltip: {  
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                }
            },
            legend: {
                top:5,
                left:5,
                data:  [typeList[0].stnm,typeList[1].stnm,typeList[2].stnm]
            },
            grid: {
                top: 70,
                bottom: 50
            },
            toolbox: { 
                show: true,
                orient: 'horizontal',    
                right: 10,
                top: 10,  
                feature: {  
                    magicType: {            //动态类型切换
                        show: true,           //是否显示该工具
                        type: ['line', 'bar'], //启用的动态类型
                        title:{
                            line:'折线图',    // 名称
                            bar:'柱状图'
                        }
                    }, 
                    saveAsImage: { show: true , title:'下载',} 
                }
            
            }, 
            xAxis:  [
                { 
                    type: 'category', 
                    position:'bottom',
                    name: '星期',
                    min: 0,   // 起始值
                    max: 6,  // 结束值  
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,-10],  
                    },
                    data: t_echartList.xArr, 
                    axisTick: {      // 轴线刻度  
                        length: 7,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    },
                    boundaryGap: false       // 不留白，从原点开始
                },
                {  
                    type: 'category', 
                    position:'bottom',
                    min: 0,   // 起始值
                    max: 6,  // 结束值  
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,-10],  
                    },
                    data: t_echartList.xArr, 
                    axisTick: {      // 轴线刻度  
                        length: 3,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    },
                    boundaryGap: false       // 不留白，从原点开始
                }
            ],
            yAxis:  {
                type: 'value',
                name: '水位(米)', 
                min: 238,
                max: 230, 
                // 替换y轴刻度的最大值和最小值
                ...myAxisObj.yAxis.week,
                axisLabel: {      // 纵轴刻度标签 
                    formatter: '{value}',  //  轴线标签
                    align: 'right'    // 轴线相对标签的位置
                }, 
	            boundaryGap: false       // 不留白，从原点开始
            },
            series: t_echartList.yArr
        };   
        // 3.使用刚指定的配置项和数据显示图表。
        myChartMiddle.setOption(option);
        setMyChartMiddleRes(myChartMiddle)

        // 4.修正位置 
        if(echartMiddleNodeRef.current) echartMiddleNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";
        // 再次修正位置  
        if(myChartTop) myChartTop.resize()
        if(myChartMiddle) myChartMiddle.resize()
        if(myChartBottom) myChartBottom.resize() 
    }
    // 显示的图表，底部
    const drawContentRightBottom = (t_echartList ) =>{     
        // 1.基于准备好的dom，初始化echarts实例
        // 清除已经生成的页面节点 
        let parentNodes = document.querySelector('#bottom-echart-bottom'); 
        parentNodes.innerHTML = ""
        // 清除原来的实例（但这里没有实际效果）
        if (myChartBottom)  myChartBottom = null;  
        // 删除原来的实例属性（或者设置为空也行）
        if(parentNodes.hasAttributes("_echarts_instance_"))  parentNodes.removeAttribute("_echarts_instance_")    
        // 注销后，重新创建实例
        myChartBottom = echarts.init(document.getElementById('bottom-echart-bottom'),'dark');
 

        // 2.指定图表的配置项和数据
        var option = {
            title: {
                text: '月水位变化曲线', 
                x:'center',
                y: 'bottom',
            },
            tooltip: {  
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                }
            },
            legend: {
                top:5,
                left:5,
                data: [typeList[0].stnm,typeList[1].stnm,typeList[2].stnm]
            },
            grid: {
                top: 70,
                bottom: 50
            },
            toolbox: { 
                show: true,
                orient: 'horizontal',    
                right: 10,
                top: 10,  
                feature: {  
                    magicType: {            //动态类型切换
                        show: true,           //是否显示该工具
                        type: ['line', 'bar'], //启用的动态类型
                        title:{
                            line:'折线图',    // 名称
                            bar:'柱状图'
                        }
                    }, 
                    saveAsImage: { show: true , title:'下载',} 
                }
            
            }, 
            xAxis:  [
                { 
                    type: 'category', 
                    position:'bottom',
                    name: '日期',
                    min: 0,   // 起始值
                    max: 30,  // 结束值  
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,-10],  
                    },
                    data: t_echartList.xArr, 
                    axisTick: {      // 轴线刻度  
                        length: 7,//刻度线的长度
                        interval: 8,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    },
                    boundaryGap: false       // 不留白，从原点开始
                },
                {  
                    type: 'category', 
                    position:'bottom',
                    min: 0,   // 起始值
                    max: 30,  // 结束值  
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,-10],  
                    },
                    data: t_echartList.xArr, 
                    axisTick: {      // 轴线刻度  
                        length: 3,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    axisLine: {       // 轴线颜色 
                        onZero: false,             // 保持轴线在底部， 非0位置
                        symbol:["none","arrow"],    //轴线箭头
                        symbolSize: [8, 10] 
                    },
                    boundaryGap: false       // 不留白，从原点开始
                }
            ], 
            yAxis:{
                type: 'value',
                name: '水位(米)', 
                min: 238,
                max: 230, 
                
                // 替换y轴刻度的最大值和最小值
                ...myAxisObj.yAxis.month,
                axisLabel: {      // 纵轴刻度标签 
                    formatter: '{value}',  //  轴线标签
                    align: 'right'    // 轴线相对标签的位置
                }, 
	            boundaryGap: false       // 不留白，从原点开始
            },
            series: t_echartList.yArr
        };   
        // 3.使用刚指定的配置项和数据显示图表。
        myChartBottom.setOption(option);
        setMyChartBottomRes(myChartBottom)

        // 4.修正位置 
        if(echartBottomNodeRef.current) echartBottomNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";
        // 再次修正位置  
        if(myChartTop) myChartTop.resize()
        if(myChartMiddle) myChartMiddle.resize()
        if(myChartBottom) myChartBottom.resize() 
    }
 
    // 设置表格扩展类型
    const onSelectDropdown = (name)=>{ 

         // 设置下拉菜单项  
         if(name == '紧缩型'){
             setIsTableCollapse(false)
             setActiveMenuName("紧缩型")
             sessionStorage.setItem("water_isTableCollapse",false)

              
            // 修正位置 
            setIsShowEchart(false);
            if(echartTopNodeRef.current){ 
                echartTopNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important";  
            }  
            if(echartMiddleNodeRef.current){ 
                echartMiddleNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important"; 
            } 
            if(echartBottomNodeRef.current){ 
                echartBottomNodeRef.current.style.cssText = "width:33.3%!important;height:100%!important"; 
            }   

            // // 再次修正位置   
            if(myChartTop) myChartTop.resize()
            if(myChartMiddle) myChartMiddle.resize()
            if(myChartBottom) myChartBottom.resize() 
            setTimeout(()=>{ 
                setIsShowEchart(true);
            },1000)
         }else{
            setIsTableCollapse(true)
            setActiveMenuName("扩展型")
            sessionStorage.setItem("water_isTableCollapse",true)
         }
  
    }  


    // 展示图表数据
    const hideCharts = ()=>{ 
        setIsLoading(true)
    }
    const showCharts = ()=>{
        if(isLeftOk && isCenterOk && isRightOk){ 
            document.querySelector(".bottom-bottom").style.opacity = 1;
            setIsLoading(false) 
        }else{
            // 延时加载
            setTimeout(()=>{
                document.querySelector(".bottom-bottom").style.opacity = 1;
                setIsLoading(false) 
            },1000) 
        } 
    }
    return (
        <div className='waterChange-div homeTable-div commTable-div'  > 
            <div className='fixTitle-div' style={{display:isShowTitle ? 'flex' : 'none'}}>     
                <Radio.Group onChange={onChange} value={radioItem}>
                    <Radio value={'day'}>日水位数据</Radio>
                    <Radio value={'week'}>周水位数据</Radio>
                    <Radio value={'month'}>月水位数据</Radio>  
                </Radio.Group>
                <div className='table-mode-div'> 
                    <div>表格模式：</div>
                    <Dropdown overlay={
                            <Menu>      
                                    <Menu.Item onClick={()=>onSelectDropdown('紧缩型')}>
                                        <div > 紧缩型 </div>
                                    </Menu.Item>  
                                    <Menu.Item onClick={()=>onSelectDropdown('扩展型')}>
                                        <div > 扩展型 </div>
                                    </Menu.Item>  
                            </Menu>
                            } placement="bottomLeft">
                                <Button type='default'>{activeMenuName}</Button>
                            </Dropdown>
                </div>
            </div>
            <div className='body-bottom-div' style={{'background':'white'}}>  
                <Spin tip="加载数据中" spinning={isLoading} style={{display:isLoading ? 'flex' : 'none'}}></Spin>
                <div className='bottom-top' style={{height:isTableCollapse ? 'inherit' : '50%',position:isTableCollapse ? 'absolute' : 'relative'}}>     
                    <Table dataSource={dataSource} columns={columns} pagination={false} sticky />
                </div> 
      
                <div className='bottom-bottom'  style={{'visibility':isTableCollapse ? 'hidden' : 'visible', 'opacity':0}} >   
                    {/* <div className='mask-div' style={{'display':isShowEchart ?'none' : 'block'}}>  </div> */}
                    <div id='bottom-echart-top' style={{width:'600px',height:'300px'}} ref={echartTopNodeRef}></div>
                    <div id='bottom-echart-middle' style={{width:'600px',height:'300px' }} ref={echartMiddleNodeRef}></div>
                    <div id='bottom-echart-bottom' style={{width:'600px',height:'300px' }} ref={echartBottomNodeRef}></div>            
                 </div>     
            </div>
        </div>
    )
}

export default WaterChange;