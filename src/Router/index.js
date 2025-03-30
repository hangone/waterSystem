// 相关的路由文件 
import {lazy} from 'react';
import Common from 'Common/index'

const Home = lazy(()=>import("../Pages/Home")) 

const MainChange = lazy(()=>import("../Pages/MainPages/HomePage/MainChange")) 
const MinuteChange = lazy(()=>import("../Pages/MainPages/HomePage/MinuteChange")) 
const WaterChange = lazy(()=>import("../Pages/MainPages/HomePage/WaterChange")) 
const RainChange = lazy(()=>import("../Pages/MainPages/HomePage/RainChange")) 
const WhouseChange = lazy(()=>import("../Pages/MainPages/HomePage/WhouseChange"))

const WaterQuality = lazy(()=>import("../Pages/MainPages/WaterPage/WaterQuality"))    
const HourWaterForm = lazy(()=>import("../Pages/MainPages/WaterPage/HourWaterForm"))  
const DayWaterForm = lazy(()=>import("../Pages/MainPages/WaterPage/DayWaterForm"))  
const MonthWaterForm = lazy(()=>import("../Pages/MainPages/WaterPage/MonthWaterForm"))  
 
const HourRainForm = lazy(()=>import("../Pages/MainPages/RainPage/HourRainForm"))  
const DayRainForm = lazy(()=>import("../Pages/MainPages/RainPage/DayRainForm"))  
const YearRainForm = lazy(()=>import("../Pages/MainPages/RainPage/YearRainForm"))  
const YearDayRainForm = lazy(()=>import("../Pages/MainPages/RainPage/YearDayRainForm"))  

const DayRainChart = lazy(()=>import("../Pages/MainPages/RainChart/DayRainChart"))  
const YearRainChart = lazy(()=>import("../Pages/MainPages/RainChart/YearRainChart"))  

const HistorySearch = lazy(()=>import("../Pages/MainPages/HandleData/HistorySearch"))  
const CurrentReset = lazy(()=>import("../Pages/MainPages/HandleData/CurrentReset"))  

// 使用说明 
const HelpPage = lazy(()=>import("../Pages/MainPages/StatementPage/HelpPage"))   

// 主路由规则
export const routerMap = [
    {path:"/",component:Home,exact:false,title:Common.projectName+'管理面板'},   
]

// 子路由规则
export const subRouterMap = [ 
    // 实时数据
    {path:"/home/homePage/mainChange",component:MainChange,exact:true,title:Common.projectName+'实时水雨情_实时主页'}, 
    {path:"/home/homePage/minuteChange",component:MinuteChange,exact:true,title:Common.projectName+'实时水雨情_小时水位数据'}, 
    {path:"/home/homePage/waterChange",component:WaterChange,exact:true,title:Common.projectName+'实时水雨情_小时雨量数据'}, 
    {path:"/home/homePage/rainChange",component:RainChange,exact:false,title:Common.projectName+'实时水雨情_小时库容数据'}, 
    {path:"/home/homePage/whouseChange",component:WhouseChange,exact:false,title:Common.projectName+'实时水雨情_实时水质数据'},
    //ai
    {path: "/home/waterPage/waterQuality", component: WaterQuality, exact: false, title: Common.projectName + '问 AI'},  

    // 雨量报表
    {path:"/home/rainPage/hourRainForm",component:HourRainForm,exact:false,title:Common.projectName+'雨情报表_分时雨量明细报表'},
    {path:"/home/rainPage/dayRainForm",component:DayRainForm,exact:false,title:Common.projectName+'雨情报表_分日雨量明细报表'},  
    {path:"/home/rainPage/yearRainForm",component:YearRainForm,exact:false,title:Common.projectName+'雨情报表_全年雨量明细报表'}, 
    {path:"/home/rainPage/yearDayRainForm",component:YearDayRainForm,exact:false,title:Common.projectName+'雨情报表_全年逐日雨量明细报表'}, 
   
    // 水位监测
    {path:"/home/waterPage/hourWaterForm",component:HourWaterForm,exact:false,title:Common.projectName+'水情报表_分时水位明细报表'}, 
    {path:"/home/waterPage/dayWaterForm",component:DayWaterForm,exact:false,title:Common.projectName+'水情报表_分日水位明细报表'}, 
    {path:"/home/waterPage/monthWaterForm",component:MonthWaterForm,exact:false,title:Common.projectName+'水情报表_分月水位明细报表'}, 
     
    // 雨量明细图
    {path:"/home/rainChart/dayRainChart",component:DayRainChart,exact:false,title:Common.projectName+'雨量明细图_日雨量明细图'}, 
    {path:"/home/rainChart/yearRainChart",component:YearRainChart,exact:false,title:Common.projectName+'雨量明细图_年雨量明细图'}, 

    // 数据处理
    {path:"/home/handleData/historySearch",component:HistorySearch,exact:false,title:Common.projectName+'数据处理_历史数据查询'}, 
    {path:"/home/handleData/currentReset",component:CurrentReset,exact:false,title:Common.projectName+'数据处理_今日数据修正'}, 

    // 使用说明 
    {path:"/home/statementPage/help",component:HelpPage,exact:false,title:Common.projectName+'使用说明'}, 

]