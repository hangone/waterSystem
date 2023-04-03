import React,{useEffect,useState,useRef} from 'react' ;
import moment from 'moment'
import { DatePicker, Button,Empty ,Spin } from 'antd';
import { SearchOutlined  } from '@ant-design/icons';
import { getDayRainChart } from 'Services/Home/search';
import { MessageTool } from 'Components/Tools/MessageTool'; 
import * as echarts from 'echarts'
import Common from 'Common';
import Tools from 'Components/Tools/ChartsData' 
import { changeDataLine} from 'Utils'
import './index.css';
 
// 引入兄弟传值模块 
import PubSub from 'pubsub-js'

function WhouseChange(){   
    // 端点编码
    let typeList  = []  
    // 默认后缀
    const afterFix =  '-01 00:00:00'
    let afterObj =  {stcd:''}
    // 初始化日期
    const [searchTxtObj,setSearchTxtObj] = useState({
        time:moment().format("YYYY-MM") + afterFix
    })  
    // 默认日期
    const [defaultValue,setDefaultValue] = useState(moment())
    // 加载器
    const [isLoading,setIsLoading] = useState(false)   
    // 图表节点
    const echartTopNodeRef = useRef();
    let [myChartTopRes,setMyChartTopRes] = useState(null)
    // 图的实例
    let myChartTop = null; 
    // 默认选中的样式, 明亮或者灰暗
    const [checkedStatus,setCheckedStatus] = useState(false)

    // 图表数据
    const [echartList,setEchartList] = useState([])
    const [echartNamesList,setEchartNamesList] = useState([])
        

    // const [columns,setColumns] = useState([])  
    // const [dataSource,setDataSource] = useState([])  

    // 图表信息
    const [isShowCharts,setIsShowCharts] = useState(false) 

    let defaultObj = { 
        'yAxis':{
            avg:5,
            line:{ 
                min:0,
                max:250, 
            },
            line1:{ 
                min:0,
                max:250, 
            },
            line2:{ 
                min:0,
                max:250, 
            },
            // 用于刻度线的设置
            line11:{ 
                min:0,
                max:50, 
            },
            line22:{ 
                min:0,
                max:50, 
            }
        },
        'series':[
            {
                'line1':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s1.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s1.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s1.color,
                        color: Common.shapeChartArr.s1.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                },
            }, 
            {
                'line2':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s2.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s2.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s2.color,
                        color: Common.shapeChartArr.s2.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }, 
            }, 
            {
                'line3':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s3.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s3.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s3.color,
                        color: Common.shapeChartArr.s3.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                },
            }, 
            {
                'line4':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s4.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s4.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s4.color,
                        color: Common.shapeChartArr.s4.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                },
            }, 
            // {
            //     'line4':{ 
            //         type: 'line',
            //         symbol: Common.shapeChartArr.s4.symbol,
            //         symbolSize: 8,
            //         lineStyle: {
            //             color: Common.shapeChartArr.s4.color,
            //             width: 2,
            //             type: 'line'
            //         },
            //         itemStyle: {
            //             borderWidth: 1.2,
            //             borderColor: Common.shapeChartArr.s4.color,
            //             color: Common.shapeChartArr.s4.color
            //         },
            //         smooth: true,
            //         emphasis: {
            //             focus: 'series'
            //         }, 
            //     },
            // }, 
            {
                'line5':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s5.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s5.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s5.color,
                        color: Common.shapeChartArr.s5.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    }, 
                }, 
            }, 
            {
                'line6':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s6.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s6.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s6.color,
                        color: Common.shapeChartArr.s6.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    }, 
                },
            }, 
            {
                'line7':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s7.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s7.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s7.color,
                        color: Common.shapeChartArr.s7.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    }, 
                },
            }, 
            {
                'line8':{ 
                    type: 'line',
                    symbol: Common.shapeChartArr.s8.symbol,
                    symbolSize: 8,
                    lineStyle: {
                        color: Common.shapeChartArr.s8.color,
                        width: 2,
                        type: 'line'
                    },
                    itemStyle: {
                        borderWidth: 1.2,
                        borderColor: Common.shapeChartArr.s8.color,
                        color: Common.shapeChartArr.s8.color
                    },
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                }
            },  
        ]

        // markPoint: {
        //     data: [
        //       { type: 'max', name: 'Max' },
        //       { type: 'min', name: 'Min' }
        //     ]
        // },
    }
 
      
    // 初始化加载
    useEffect(()=>{
        try{ 
            // 获取平均雨量
            let stcdString = ''  
            let t_columns = [
                {
                    title:'日期',
                    dataIndex:'month',
                    key:'month',
                }
            ];  

            Common.rainData.forEach((item,index)=>{ 
                if(index == 0){ 
                    stcdString += item.stcd
                }else{ 
                    stcdString =  stcdString  + ',' + item.stcd 
                }
                t_columns.push({
                    title:item.stnm,
                    dataIndex:item.stcd,
                    key:item.stcd,
                }) 
            })  
            t_columns.push({
                title:'平均雨量',
                dataIndex:'avg',
                key:'avg',
            })

            
            // 默认搜索的站点
            afterObj = {
                stcd:stcdString
            }
            typeList = Common.rainData

            // 图表内容 
            setSearchTxtObj({
                stcd:stcdString
            })  
 
            // 设置默认日期 ，开启搜索(日期已经有默认值)
            // YYYY-MM-DD HH:mm:ss
            onSelectDate(null,moment().format('YYYY-MM'))
            setSearchTxtObj({
                ...searchTxtObj,
                stcd:stcdString
            })  
            onSearchChart({
                ...searchTxtObj,
                stcd:stcdString
            }) 
        }catch(err){
            console.log("出现异常",err)
            MessageTool('系统出现异常！请刷新重试','error')
        } 
    },[])

    
    // 监听页面的尺寸变化 
    useEffect(() => { 
        window.addEventListener("resize", function() { 
            if(myChartTop) myChartTop.resize() 
        });  
        return () => {
            window.removeEventListener("resize",()=>{});
            if(myChartTop) myChartTop.dispose() 
        };
    }, [window]);


    // 监听PubSub.subscribe 的变化
    useEffect(()=>{  
        PubSub.subscribe("water_leftcollapsed",(msg,stateObj)=>{     

            let parentNode1 = document.querySelector("#bottom-echart-top")
            let childrenNode1 = document.querySelector("#bottom-echart-top>div")
            let canvasNode1 = document.querySelector("#bottom-echart-top>div canvas")
            parentNode1.style.cssText = "width:100%!important;height:100%!important"; 
            childrenNode1.style.cssText = "width:100%!important;height:100%!important;display:flex!important;justify-content:center";  
            canvasNode1.style.cssText = "width:100%!important;height:96%!important;z-index:999"; 
            if(myChartTopRes) myChartTopRes.resize() 
           
            setMyChartTopRes(myChartTopRes) 
        })   
        return ()=>{ 
            PubSub.unsubscribe("water_leftcollapsed")
        }
    },[PubSub.subscrib ])


    //   搜索按钮
    const onSearchChart = (initData = null)=>{
        if(!searchTxtObj.time && !initData){   
            MessageTool('请选择月份','warning')
            return;
        }

        
        // 1.清除目标节点下的旧内容 
        const preNode = document.querySelector(".body-bottom-div")
        const curNode = document.querySelector('#bottom-echart') 
        const newNode = document.createElement('div')
        newNode.setAttribute('id','bottom-echart')
        // newNode.style.cssText="position:relative;right:0;bottom:0;width:calc(100vw - 15vw);height:calc(100vh - 15vh)"
        // style={{width:'1200px',height:'500px'}} 
        newNode.style.cssText=" width:1200px;height:500px"
        if(curNode){          
            preNode.removeChild(curNode)
            preNode.appendChild(newNode)
        }

        // 2.获取远程数据
        let paramsObj = null
        if(Object.keys(initData) && Object.keys(initData).length ==2){
            paramsObj = initData
        }else{
            paramsObj = searchTxtObj  
        } 

        // 3.选择的时间比返回的数据早1年， 因此提交数据时需要新添加年。
        // let prefix = parseInt(paramsObj.time.slice(0,4)) + 1; 
        // paramsObj = {
        //     ...paramsObj,
        //     time:prefix + paramsObj.time.slice(4)
        // }

        // 4.重新设置站点数据
        typeList = Common.rainData
 
        setIsLoading(true) 
        getDayRainChart(paramsObj).then(res=>{
            // console.log("getDayRainChart返回的数据是",res,res.data)

            let lines = res.data.data
            let lines1 = res.data.zsdrp
            let lines2 = res.data.zsrz
 
            // 切割超出的日期数据
            let lines_t = {}
            
            let searchTime = paramsObj.time.slice(0,10);
            let curTime = moment().format("YYYY-MM-DD");

            // 如果是当月的，则以当前的日期计算，如果不是，则以整个月计算
            let judge1 = moment(searchTime,"YYYY-MM-DD").format("M")
            let judge2 = moment(curTime,"YYYY-MM-DD").format("M")
            let dayLen = 0;  
            let prefix = moment(searchTime,"YYYY-MM-DD").format("YYYY-MM-")  
            if(judge1 == judge2){
                dayLen = parseInt(moment(curTime,"YYYY-MM-DD").format("D"))
            }else if(moment(searchTime,"YYYY-MM-DD") > moment(curTime,"YYYY-MM-DD")){
                dayLen = 0
                prefix = ''
            }else{
                dayLen = parseInt(moment(searchTime,"YYYY-MM").daysInMonth())
            }  
            Object.keys(lines).sort().forEach((item,index)=>{ 
                let t_index = (index + 1) < 10 ? '0' + (index + 1) : index + 1
                if(item.startsWith(prefix + t_index) && index <= dayLen){
                    lines_t[item] = lines[item] 
                } 
            })
            lines = lines_t 
            
            // // 0.多余数据处理
            // let t_lines1List = Object.keys(lines1)
            // let t_lines1Obj = {}
            // if(t_lines1List && t_lines1List.length > 31){
            //     let mid = t_lines1List.length / 2
            //     t_lines1List.some((item,index)=>{
            //         if( index > mid){
            //             t_lines1Obj[item]  = lines1[item]
            //         }
            //     })
            // }
            // lines1 = t_lines1Obj
            // // 2.多余数据处理
            // let t_lines2List = Object.keys(lines2)
            // let t_lines2Obj = {}
            // if(t_lines2List && t_lines2List.length > 31){
            //     let mid = t_lines2List.length / 2
            //     t_lines2List.some((item,index)=>{
            //         if( index > mid){
            //             t_lines2Obj[item]  = lines2[item]
            //         }
            //     })
            // }
            // lines2 = t_lines2Obj


            const xArr =  Tools.handleChartsDataX(lines1)
            const yArr =  Tools.handleChartsDataY(lines,'drp')   
 
 

            // 1.修改数据,名称
            let t_xArr = []  
            let t_yArr = []
            let t_echartNamesList = []
            // 获取名称 
            typeList.forEach(item=>{
                t_echartNamesList.push(item.stnm)
            })
            t_echartNamesList = [...t_echartNamesList ,'闸室水位']


            // 2.获取图表x轴、y轴数据
            let xArrLen = moment(searchTxtObj.time.slice(0,10)).daysInMonth();
            let xArrPrefix = searchTxtObj.time.slice(0,8)
            let xArrAfterfix = searchTxtObj.time.slice(10)
            for(let index = 0;index < xArrLen;index ++){
                let t_xArrPrefix = (index + 1)< 10 ? "0" + ( index + 1) : index + 1
                t_xArr.push( xArrPrefix + t_xArrPrefix)
            } 

            // (1.替换原数据名称
            let turns = 0;
            yArr.forEach((item)=>{ 
                typeList.some((subItem)=>{ 
                    if(subItem.stcd == item.name){ 
                        t_yArr.push({
                            ...defaultObj.series[turns]["line"+(turns+1)],
                            name:subItem.stnm,
                            data:item.data
                        }) 
                        turns += 1
                        return false;
                    }
                }) 
            }) 
            // （2.闸室降雨量
            // let t_zsdrp = Object.keys(lines1).map(item=>{
            //     return changeDataLine(lines1[item])
            // })
            // t_yArr.push({
            //     ...defaultObj.series[turns]["line"+(turns+1)],
            //     name:'闸室降雨',
            //     data:t_zsdrp
            // })
            // turns+=1; 
            // （3.闸室水位
            let t_zsrz = Object.keys(lines2).sort().map((item,index)=>{
                if(index < dayLen){ 
                     let t = changeDataLine(lines2[item])
                     if(t == '-') t = null 
                     return  t;
                }else{
                    return null;
                } 
            })
            t_yArr.push({
                ...defaultObj.series[turns]["line"+(turns+1)],
                name:'闸室水位',
                yAxisIndex: 1,  // (水位坐标轴)
                data:t_zsrz
            })
            turns+=1;
  
            // 3.计算y轴最大值与最小值 
            let t_min1 = 100000;
            let t_max1 = 0;
            let t_min2 = 100000;
            let t_max2 = 0;
            let len = t_yArr.length;
            t_yArr.forEach((item,index)=>{
                if(index < len - 2){ 
                    let max1 = item.data.reduce((sum,item)=>{
                        return Math.max(sum,(item ? item : 0))
                    },t_max1)
                    let min1 = item.data.reduce((sum,item)=>{
                        return Math.min(sum,(item ? item : 0))
                    },t_min1) 
                    if(max1 > t_max1){
                        t_max1 = max1
                    }
                    if(min1 < t_min1){
                        t_min1 = min1
                    }
                }else{ 
                    let max2 = item.data.reduce((sum,item)=>{
                        return Math.max(sum,(item ? item : 0))
                    },t_max2)
                    let min2 = item.data.reduce((sum,item)=>{
                        return Math.min(sum,(item ? item : 0))
                    },t_min2) 
                    if(max2 > t_max2){
                        t_max2 = max2
                    }
                    if(min2 < t_min2){
                        t_min2 = min2
                    } 
                }
            }) 
            // (1.计算雨量的最大值和最小值
            t_min1 = Math.floor(t_min1 - defaultObj.yAxis.avg)
            t_max1 = Math.ceil(t_max1 + defaultObj.yAxis.avg)
            if(t_min1 == 100000 - defaultObj.yAxis.avg ) t_min1 = 0
            if(t_min1<0) t_min1 = 0
            if(t_max1<=5) t_max1 = 250
            if(t_max1 <= t_min1){
                t_max1 = 250;
                t_min1 = 0;
            } 
            t_max1 = (Math.ceil(t_max1 / 5 ) + 1 ) * 5
            t_min1 = (Math.floor(t_min1 / 5 )) * 5
            // (2.计算水位的最大值和最小值
            t_min2 = Math.floor(t_min2 - defaultObj.yAxis.avg)
            t_max2 = Math.ceil(t_max2 + defaultObj.yAxis.avg)
            if(t_min2 == 100000 - defaultObj.yAxis.avg ) t_min2 = 0
            if(t_min2<0) t_min2 = 0
            if(t_max2<=5) t_max2 = 250
            if(t_max2 <= t_min2){
                t_max2 = 250;
                t_min2 = 0;
            } 
            t_max2 = (Math.ceil(t_max2 / 5 ) + 1 ) * 5
            t_min2 = (Math.floor(t_min2 / 5 )) * 5
 
            
            // 4.获取刻度线的最大值与最小值
            let t_max11 = ''
            let t_min11 = 0
            let t_max22 = ''
            let t_min22 = 0 
            // (1.获取雨量的刻度值
            //  5 , 2 , 10
            let t11 =  (Math.floor((t_max1 - t_min1)/2) == (t_max1 - t_min1)/2) ? true : false
            let t11_v = (t_max1 - t_min1)/2
            let t12 =  (Math.floor((t_max1 - t_min1)/5) == (t_max1 - t_min1)/5) ? true : false
            let t12_v = (t_max1 - t_min1)/5
            let t13 =  (Math.floor((t_max1 - t_min1)/10) == (t_max1 - t_min1)/10) ? true : false
            let t13_v = (t_max1 - t_min1)/10
            if(t12 &&  t12_v< 50){
                t_max11 = t12_v
            }else if(t11 &&  t11_v< 50){
                t_max11 = t11_v
            }else if(t13 &&  t13_v< 50){
                t_max11 = t13_v
            }
            // (2.获取水位的刻度值
            //  5 , 2 , 10
            let t21 =  (Math.floor((t_max2 - t_min2)/2) == (t_max2 - t_min2)/2) ? true : false
            let t21_v = (t_max2 - t_min2)/2
            let t22 =  (Math.floor((t_max2 - t_min2)/5) == (t_max2 - t_min2)/5) ? true : false
            let t22_v = (t_max2 - t_min2)/5
            let t23 =  (Math.floor((t_max2 - t_min2)/10) == (t_max2 - t_min2)/10) ? true : false
            let t23_v = (t_max2 - t_min2)/10
            if(t22 &&  t22_v< 50){
                t_max22 = t22_v
            }else if(t21 &&  t21_v< 50){
                t_max22 = t21_v
            }else if(t23 &&  t23_v< 50){
                t_max22 = t23_v
            } 
            defaultObj = {
                ...defaultObj.series,
                'yAxis':{
                    ...defaultObj.yAxis.avg,
                    line1:{ 
                        max:t_max1,
                        min:t_min1
                    },
                    line2:{ 
                        max:t_max2 ,
                        min:t_min2
                    },

                    line11:{ 
                        max:t_max11,
                        min:t_min11
                    },
                    line22:{ 
                        max:t_max22,
                        min:t_min22
                    }
                }
            } 
 

            // 5.获取分度标尺
            // (1.x轴获取0.5倍的空刻度值 
            let xArr1  = [...t_xArr ].map((item,index)=>{  return ''  }) 
            // (2.y轴根据最大值和最值判断最小刻度（雨量）
            let yArr1  =  []
            let bigTickLen1 = (defaultObj.yAxis.line1.max - defaultObj.yAxis.line1.min )/ 10
            if(bigTickLen1 <= 10) bigTickLen1 *= 5; 
            for(let i=0;i<bigTickLen1 ; i++){
                yArr1.push('')
            }
            // (3.y轴根据最大值和最值判断最小刻度（水位）
            let yArr2  =  []
            let bigTickLen2 = (defaultObj.yAxis.line2.max - defaultObj.yAxis.line2.min )/ 10
            if(bigTickLen2 <= 10) bigTickLen2 *= 5;
            for(let i=0;i<bigTickLen2 ; i++){
                yArr2.push('')
            } 

            const t_echartList = { 
                xArr:t_xArr,
                yArr:t_yArr,
                xArr1:xArr1,
                yArr1:yArr1,
                yArr2:yArr2,
            }    
            // // 相对来说, react的组件内部的状态是异步的。并不能立即执行
            // // 表示图表 
            setIsShowCharts(true)

            setEchartList(t_echartList)
            setEchartNamesList(t_echartNamesList)

            drawContentRight(t_echartList,t_echartNamesList); 
            setIsLoading(false)
        }).catch(err=>{  
            setIsLoading(false)
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        })
    }

    // 选择日期
    const onSelectDate = (date,dateString)=>{
        const fixDateString = dateString + afterFix;

        const params = {
            ...searchTxtObj,
            time:fixDateString
        }
        setSearchTxtObj(params) 
    }

    
    // 显示的图表
    const drawContentRight = (t_echartList,echartNamesList,t_checkedStatus = true ) =>{
                
    // 基于准备好的dom，初始化echarts实例
        // let mode = t_checkedStatus ? 'light' : 'dark'
        let mode =  'dark' 
        // 清除已经生成的页面节点 
        let parentNodes = document.querySelector('#bottom-echart-top'); 
        parentNodes.innerHTML = ""
        // 清除原来的实例（但这里没有实际效果）
        if (myChartTop)  myChartTop = null;  
        // 删除原来的实例属性（或者设置为空也行）
        if(parentNodes.hasAttributes("_echarts_instance_"))  parentNodes.removeAttribute("_echarts_instance_")    
        // 注销后，重新创建实例
        myChartTop = echarts.init(document.getElementById('bottom-echart-top'),'light');
          
        let dayLen = moment(searchTxtObj.time.slice(0,10)).daysInMonth();
        let dayLenInterval = (dayLen <= 28 ? 2 : 3) 

        const colors = ['#5470C6', '#91CC75', '#EE6666'];
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '各站点日雨量明细图', 
                left:'center',
                top: 0,
                // 文字颜色
                textStyle: {
                    color: '#b8b8b8'
                    // ...
                },
            },
            tooltip: { 
                // axios | none  
                // position:[0,0],
                // line, cross,  shadow
                axisPointer: {
                    type: 'line'
                    // type: 'cross'
                },
                trigger: 'axis',
                // formatter: function(params){    // 垂直排列
                //     let newParams = [];
                //     let tooltipString = [];
                //     newParams = [...params];
                //     newParams.sort((a,b) => {return b.value - a.value});
                //     newParams.forEach((p) => {
                //         const cont = p.marker + ' ' + p.seriesName + ': ' + p.value + '<br/>';
                //         tooltipString.push(cont);
                //     });
                //     return tooltipString.join('');
                // }
            },
            legend: { 
                orient:'vertical',
                top:'center',
                right:0,
                // 文字颜色
                textStyle: {
                    color: '#b8b8b8'
                    // ...
                },
                data: echartNamesList
            },
            grid: {
                top: 30,
                bottom: '12%',
                left:60,
            },
            toolbox: { 
                show: true,
                orient: 'horizontal',   
                right:200,
                top: -7,  
                feature: {  
                    dataZoom: {
                    //   yAxisIndex: 'none', 
                      title:"区域放缩"
                    },
                    restore: {
                        title:"还原"
                    },
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
            // calculable: true,
            xAxis: [
                {
                    type: 'category',   // 分类的轴线
                    position:'bottom',
                    name: '日期', 
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,0],  
                     },
                    position: 'bottom',
                    axisLine: {          // 轴线对齐0刻度线
                        onZero: false,
                        show: true,
                        symbol:["none","arrow"],    //轴线箭头
                        symbolOffset:[18,0],
                        lineStyle:{ 
                          color:'#6E7079',
                          shadowOffsetX:18,	//利用阴影进行延长 ！！！
                          shadowColor:'#6E7079'
                        } 
                    }, 
                    axisTick: { 
                        // alignWithLabel: false,   // 清除刻度线
                        length: 9,//刻度线的长度
                        interval: 2,  //该{}中的data全部显示    (非28则为 3  ， 28则为 2)
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    }, 
                    // splitLine:{show:true},   // 显示分割线
                    data: t_echartList.xArr,
 
    	            boundaryGap: false // 不留白，从原点开始
                }, 
                { 
                    position:'bottom', 
                    nameTextStyle:{   // name标签文字样式
                        padding:[0,0,0,0],  
                     },
                    position: 'bottom',
                    axisLine: {          // 轴线对齐0刻度线
                        onZero: false,
                        show: true,
                        symbol:["none","arrow"],    //轴线箭头
                        symbolOffset:[18,0],
                        lineStyle:{ 
                          color:'#6E7079',
                          shadowOffsetX:18,	//利用阴影进行延长 ！！！
                          shadowColor:'#6E7079'
                        } 
                    }, 
                    axisTick: { 
                        // alignWithLabel: false,   // 清除刻度线
                        length: 5,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    }, 
                    // splitLine:{show:true},   // 显示分割线
                    data: t_echartList.xArr,
 
    	            boundaryGap: false // 不留白，从原点开始
                },
            ], 
            yAxis:[
                {
                    type: 'value',
                    // splitLine:{show:false},   // 去除分割线
                    min:0,
                    max:250,
                    ...defaultObj.yAxis.line1,
                    name: '降水量(/毫米)',
                    position: 'left',             // 纵轴线
                    axisLine: {
                        show: true,  
                        symbol:["none","arrow"],    //轴线箭头
                        symbolOffset:[0,18],
                        lineStyle:{ 
                          color:'#6E7079',
                          shadowOffsetY:-18,	//利用阴影进行延长 ！！！
                          shadowColor:'#6E7079'
                        } 
                        //lineStyle: {
                        //   color: colors[2]
                        //}
                    },  
                    axisTick: { 
                        // alignWithLabel: false,   // 清除刻度线
                        length: 8,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },  
                    axisLabel: {             // 纵轴刻度标签
                        interval: 0,
                        show: true,
                        textStyle: { 
                            fontFamily: "微软雅黑",
                            fontSize: 12
                        },
                        formatter: '{value}'
                    },   
    	            boundaryGap: false // 不留白，从原点开始
                },

                //  设置最小值为230
                {
                    type: 'value',
                    splitLine:{show:false},   // 去除分割线
                    max:250,
                    ...defaultObj.yAxis.line2,
                    min:230,
                    name:"水位(/米)",
                    position: 'right',
                    axisLine: {
                        show: true, 
                        symbol:["none","arrow"],    //轴线箭头
                        symbolOffset:[0,18],
                        lineStyle:{ 
                          color:'#6E7079',
                          shadowOffsetY:-18,	//利用阴影进行延长 ！！！
                          shadowColor:'#6E7079'
                        } 
                        // lineStyle: {
                        //    color: colors[0]
                        // }
                    }, 
                    axisTick: { 
                        // alignWithLabel: false,   // 清除刻度线
                        length: 8,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },  
                    axisLabel: { 
                        interval: 0,
                        show: true,
                        textStyle: { 
                            fontFamily: "微软雅黑",
                            fontSize: 12
                        },
                        formatter: '{value}',
                        align:'left'     // 纵轴线的位置
                    },  
    	            boundaryGap: false // 不留白，从原点开始
                },


                // 生成更细小的刻度值，1倍 （雨量）
                //第二个{}是为了 生成数字1 倍数的刻度
                {
                    position: 'left',
                    ...defaultObj.yAxis.line11,
                    // axisLine: {    // 轴线对齐0刻度线
                    //     show: true,
                    // },
                    axisTick: { 
                        length: 8,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    data: t_echartList.yArr1,  // 2倍的空刻度
    	            boundaryGap: false // 不留白，从原点开始
                },
                // 生成更细小的刻度值，1倍 （水位）
                //第二个{}是为了 生成数字1 倍数的刻度
                {
                    position: 'right',
                    ...defaultObj.yAxis.line22,  // 不重叠前面的数据
                    axisLine: {    // 轴线对齐0刻度线
                        show: true,
                    },
                    axisTick: { 
                        length: 8,//刻度线的长度
                        interval: 0,  //该{}中的data全部显示
                        lineStyle: { 
                            color: '#ccc',
                            fontSize: '20px'
                        }
                    },
                    data: t_echartList.yArr2,  // 2倍的空刻度
    	            boundaryGap: false // 不留白，从原点开始
                }  
            ],
            // 放缩标记尺
            // dataZoom: [
            //   {
            //     startValue: '2021-01-01'
            //   },
            //   {
            //     type: 'inside'
            //   }
            // ], 
            // 背景色
            // backgroundColor: {
            //     type: 'radial', 
            //     colorStops: [
            //       {
            //         offset: 0,
            //         color: '#112041'
            //       },
            //     //   {
            //     //     offset: 1,
            //     //     color: '#cdd0d5'
            //     //   }
            //     ]
            // },
            series: t_echartList.yArr 
        };  
 
        // 使用刚指定的配置项和数据显示图表。
        myChartTop.setOption(option); 
        setMyChartTopRes(myChartTop)
        
        // 修正位置 
        if(echartTopNodeRef.current){ 
            echartTopNodeRef.current.style.cssText = "width:95%!important;height:95%!important";
        }  
        if(myChartTop) myChartTop.resize()
    }

    // 切换图表风格
    // const onChangeState = (e)=>{ 
    //     setCheckedStatus(e) 
    //     let node = document.getElementById('bottom-echart')
    //     // if(node){
    //     //     node.parentNode
    //     // }
    //     drawContentRight(echartList,echartNamesList,e); 
    // }


    return (
        <div className='dayRainChart1-div commTable-div'>
            <div className='body-top-div'>
                <div className='top-left'> 
                    <div className='date-div'>
                        <span>查询月份：</span> 
                        <DatePicker allowClear={false} inputReadOnly={true} onChange={onSelectDate} defaultValue={defaultValue}  picker="month" placeholder="2021年1月1日起"/>
                    </div> 
                    <Button type="default" shape="round"  onClick={onSearchChart}  size='default' icon={<SearchOutlined />}/>
  
                    {/* <div className='date-div' style={{'justifyContent':'center'}}>
                        <span>图表风格：</span>  
                        <Switch checkedChildren="明亮" unCheckedChildren="灰暗"   onChange={onChangeState}/>
                    </div>  */}
                </div>
                <div className='top-right'>  
                    <div className='top-title'>日雨量明细图</div>
                </div>
                 
            </div> 
            <div className='body-bottom-div'>   
                <Spin spinning={isLoading} style={{display:isLoading ? "flex" : 'none'}}> </Spin>
                {/* <Table dataSource={dataSource} columns={columns} />; */}
                {
                    !isShowCharts
                    ?<Empty style={{zIndex:1}}/>
                    :<div id='bottom-echart-top' style={{width:'1200px',height:'500px'}} ref={echartTopNodeRef}></div>
                } 
            </div>
        </div>
    )
}

export default WhouseChange;