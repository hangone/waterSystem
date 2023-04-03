import React,{useEffect,useState,useRef} from 'react' ;
import { DatePicker , Button ,Menu, Dropdown  ,Table  } from 'antd';
import moment from 'moment'
import { SearchOutlined  } from '@ant-design/icons';
import { geHourRainForm,getHourWaterForm } from 'Services/Home/search';
import { MessageTool } from 'Components/Tools/MessageTool';   
import {reverseFormatDate2,changeMomentType} from 'Utils'

import Common from 'Common';
import Tools from 'Components/Tools/TablesData'   
import './index.less';
  

function DayRainForm(){  
    // 端点编码
    let typeList1  = []  
    let typeList2  = []   
    // 默认后缀
    const afterFix =  ':00:00';
    // 初始化日期
    const [searchTxtObj,setSearchTxtObj] = useState({ })   

    const [defaultStartValue,setDefaultStartValue] = useState(changeMomentType(moment,'YYYY-MM-DD HH').subtract(2,'day'))
    const [defaultEndValue,setDefaultEndValue] = useState(moment())

    // 表格是否扩展
    const [activeMenuName,setActiveMenuName] = useState('雨情数据' )
    const initTime = moment().format('YYYY-MM-')+'01 00' ;


    // 加载中
    const [isLoading,setIsLoading] = useState(false)
    // 表格表头，和行列数据。
    const [columns,setColumns] = useState([])  
    const [dataSource,setDataSource] = useState([])  
    // 行列表格
    const [colArr,setColArr] = useState([])
    const [rowArr,setRowArr] = useState([])
    
    // 列数据（不含顶部栏的表头）
    let rowTitleArr1  =  [ 
        {month:'最大时降雨量'},
        {month:'累计下雨天数'},
        {month:'累计下雨>20mm天'},
        {month:'累计降雨量'},
        {month:'发生时间'}, 
    ] 
    let rowTitleArr2  =  [ 
        {month:'最高水位'},
        {month:'发生时间'},
        {month:'最低水位'},
        {month:'发生时间'},
        {month:'平均水位'},  
    ]
 
      
    // 初始化加载
    useEffect(()=>{
        try{ 
            let stcdString = ''   

            if(activeMenuName == '雨情数据'){ 
                //  （1.默认搜索的雨量站点
                Common.rainData.forEach((item,index)=>{ 
                    if(index == 0){ 
                        stcdString += item.stcd
                    }else{ 
                        stcdString =  stcdString  + ',' + item.stcd 
                    } 
                })   
                typeList1 = Common.rainData
            }else{ 
                // //  （2.默认搜索的水位站点
                Common.waterData.forEach((item,index)=>{ 
                    if(index == 0){ 
                        stcdString += item.stcd
                    }else{ 
                        stcdString =  stcdString  + ',' + item.stcd 
                    } 
                })   
                typeList2 = Common.waterData
            }

   
            // （2.设置默认日期 ，开启搜索(日期已经有默认值)
            // YYYY-MM-DD HH:mm:ss
            let startTime = changeMomentType(moment,'YYYY-MM-DD HH').subtract(2,'day').format('YYYY-MM-DD HH')+afterFix;
            // 设置成当前具体时间 
            let endTime = moment().format('YYYY-MM-DD HH')+afterFix ;
  
            onSelectStartDate(null,startTime)
            onSelectEndDate(null,endTime)

            let paramsObj ={ startTime, endTime,overTime:endTime, stcd:stcdString }
            setSearchTxtObj(paramsObj) 
            onSearchTable(null, paramsObj)  
        }catch(err){
            console.log("出现异常",err)
            MessageTool('系统出现异常！请刷新重试','error')
        } 
    },[])


    //   搜索数据
    const onSearchTable = (e, initData = null)=>{
        let verifyParams =  initData ? initData :searchTxtObj 
        if(!verifyParams.startTime || verifyParams.startTime.startsWith(":") ){   
            MessageTool('请选择开始日期','warning')
            return;
        }else if(!verifyParams.endTime || verifyParams.endTime.startsWith(":") ){   
            MessageTool('请选择结束日期','warning')
            return;
        }else if(verifyParams.endTime  < verifyParams.startTime){   
            MessageTool('开始日期不能大于结束日期','warning')
            return;
        }

        // 2.获取远程数据
        let paramsObj = null
        if(  initData){
            paramsObj = initData
        }else{
            paramsObj = searchTxtObj  
        }   

        setIsLoading(true)
 
        if(activeMenuName == '雨情数据'){  
            // (1.雨量查询数据
            onSearchRainTable(paramsObj)
        }else{
            // (2.水位查询数据 
            onSearchWaterTable(paramsObj)
        }
    }
    // (1.雨量查询数据
    const onSearchRainTable = (paramsObj)=>{  
        geHourRainForm(paramsObj).then(res=>{
            // console.log("geHourRainForm返回的数据是",res,res.data) 

            // 空值检测
            if(res.data.datas.length == 0){
                setIsLoading(false)
                setDataSource([])
                return;
            } 
            let stcdString = ''  
            let t_columns = [];
            let t_colArr = ['日期'] 
            let t_rowArr = ['日期'] 

            // （1.遍历行表头数据
            t_columns.push( {
                title:'日期',
                dataIndex:'month',
                key:'month',
                width:250
            })
            // 雨量站点数据
            Common.rainData.forEach((item,index)=>{ 
                if(index == 0){ 
                    stcdString += item.stcd
                }else{ 
                    stcdString =  stcdString  + ',' + item.stcd 
                }
                t_columns.push({
                    title:item.stnm+'(毫米)',
                    dataIndex:item.stcd,
                    key:item.stcd,
                }) 
                t_colArr.push(item.stnm+'(毫米)')
            })    
            // 闸室水位
            t_columns.push({
                title:'闸室水位(米)',
                dataIndex:'zsrz',
                key:'zsrz',
            }) 
            t_colArr.push('闸室水位(米)')
            // 闸室库容
            t_columns.push({
                title:'库容(万立方米)',
                dataIndex:'zsw',
                key:'zsw',
            }) 
            t_colArr.push('库容(万立方米)')

            // （2.遍历列表头数据
            rowTitleArr1.forEach(item=>{
                t_rowArr.push(item.month)
            })
            setColArr(t_colArr) 
            setRowArr(t_rowArr) 
            setColumns(t_columns) 



             // （3.遍历行数据
             let new_data1 = res.data.datas.sort();  
             let t_t_rowArr = [];
             let t_rowTitleArr = [];
             new_data1.forEach(item=>{
                 var name = reverseFormatDate2(item.tm) ;
                t_t_rowArr.push(name);
            })  
            t_t_rowArr = [...new Set(t_t_rowArr)]
            t_t_rowArr = [...new Set(t_t_rowArr)].sort()
            rowTitleArr1.forEach(item=>{ 
                t_t_rowArr.push(item.month)
            }) 
            t_t_rowArr.forEach(item=>{
                t_rowTitleArr.push({month:item})
            }) 
            setRowArr(t_t_rowArr)  
            rowTitleArr1 = t_rowTitleArr
  
            setIsLoading(false)
            // let prefix = paramsObj.startTime.slice(0,4)
            let prefix = ''
            let rowLen = t_rowTitleArr.length; 
            let t_dataResource = Tools.handleHourRainTableDataY(typeList1,res.data,rowLen,13,rowTitleArr1,prefix)  
            // (4.获取目标数据
            let len = t_dataResource.length
            let new_dataResource = [t_dataResource[len-5],t_dataResource[len-2],t_dataResource[len-1]] 

            // (5.重置列表格数据
            setDataSource(new_dataResource) 
        }).catch(err=>{ 
            setIsLoading(false)
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        }) 
    
    }
    // (2.水位查询数据
    const onSearchWaterTable = (paramsObj)=>{ 
        getHourWaterForm(paramsObj).then(res=>{ 
 
            // console.log("getHourWaterForm返回的数据是",res,res.data)
            setIsLoading(false)

                // 获取平均雨量
                let stcdString = ''  
                let t_columns = []; 
                let t_colArr = ['时间'] 
                let t_rowArr = ['时间'] 
    
                // （1.遍历列表头数据
                t_columns.push(  {
                    title:'时间',
                    dataIndex:'month',
                    key:'month',
                    width:250
                })
                Common.waterData.forEach((item,index)=>{ 
                    if(index == 0){ 
                        stcdString += item.stcd
                    }else{ 
                        stcdString =  stcdString  + ',' + item.stcd 
                    }
                    t_columns.push({
                        title:item.stnm+'(米)',
                        dataIndex:'water'+item.stcd,
                        key:'water'+item.stcd,
                        width:160,
                    }) 
                    t_colArr.push(item.stnm+'(米)') 
    
                    // 间隔设置
                    if(index == 0){ 
                        t_columns.push({
                            title:'库容(万立方米)',
                            dataIndex:'kurong'+item.stcd,
                            key:'kurong'+item.stcd,
                            width:180,
                        }) 
                        t_colArr.push('库容')
                    }else if(index == 1){ 
                        t_columns.push({
                            title:'入库流量(立方米/秒)',
                            dataIndex:'inflow'+item.stcd,
                            key:'inflow'+item.stcd,
                            width:180,
                        }) 
                        t_colArr.push('入库流量(立方米/秒)')
                    }else if(index == 2){ 
                        t_columns.push({
                            title:'出库流量(立方米/秒)',
                            dataIndex:'outflow'+item.stcd,
                            key:'outflow'+item.stcd,
                            width:180,
                        }) 
                        t_colArr.push('出库流量(立方米/秒)')
                    }
                })         
                    
            // （2.遍历行表头数据
            rowTitleArr2.forEach(item=>{
                t_rowArr.push(item.month)
            })

            // 默认搜索的站点
            let afterObj = {  stcd:stcdString }
            typeList2 = Common.waterData
    
            setColArr(t_colArr) 
            setRowArr(t_rowArr) 
            setColumns(t_columns) 

            //  // （2.遍历行表头数据
             let new_data1 = res['data1:'].data.sort(); 
             let t_rowTitleArr = [];
             t_rowArr = [];
             new_data1.forEach(item=>{
                 var name = reverseFormatDate2(item.tm) ;
                t_rowTitleArr.push({month:name})
            }) 
            rowTitleArr2 = [...t_rowTitleArr,...rowTitleArr2]
            rowTitleArr2.forEach(item=>{
                t_rowArr.push(item.month)
            })
            setRowArr(t_rowArr)  
  
            let t_dataResource = Tools.handleHourWaterTableDataY(typeList2,res,31,10,rowTitleArr2 )  

            // （4.获取目标数据
            let len = t_dataResource.length;
            let  new_dataResource = [t_dataResource[len-5],t_dataResource[len-4],t_dataResource[len-3],t_dataResource[len-2],t_dataResource[len-1]]
            setDataSource(new_dataResource)
        }).catch(err=>{ 
            setIsLoading(false)
            console.log("请求超时！请重试",err)
            MessageTool('请求超时！请重试','error')
        }) 
    }

    // 选择日期
    const onSelectStartDate = (date,dateString )=>{
        const fixDateString =  dateString; 
        const params = {
            ...searchTxtObj,
            startTime:fixDateString
        }
        setSearchTxtObj(params)  
        // 改变默认的日期 
        setDefaultStartValue(moment(fixDateString.slice(0,15))) 
    }
    const onSelectEndDate = (date,dateString)=>{   
        const fixDateString = dateString  ; 
        const params = {
            ...searchTxtObj,
            endTime:fixDateString,
            overTime:fixDateString
        }
        setSearchTxtObj(params)  
        // 改变默认的日期  
        setDefaultEndValue(moment(fixDateString.slice(0,15))) 
    }
  
    // 设置表格扩展类型
    const onSelectDropdown = (name)=>{  
        switch(name){
            case '雨情数据': 
                setActiveMenuName("雨情数据")  
                break;
            case '水情数据': 
                setActiveMenuName("水情数据") 
                break; 
            default:
                console.log("选错了") 
                break;
        }  
   }  

    return (
        <div className='dayRainChart-div commTable-div'>
            <div className='body-top-div'>
                <div className='top-left'>  
                    <div className='date-div table-div' style={{width:'19rem'}}>
                        <span>开始日期：</span> 
                        <DatePicker allowClear={false} inputReadOnly={true}  onChange={onSelectStartDate} picker="day" showTime value={defaultStartValue}   placeholder="请选择"/>
                    </div>     
                    <div className='date-div table-div' style={{width:'19rem'}}>
                        <span>结束日期：</span> 
                        <DatePicker allowClear={false} inputReadOnly={true}  onChange={onSelectEndDate} picker="day" showTime  value={defaultEndValue}   placeholder="请选择"/>
                    </div>              
                    
                    <div className='table-mode-div'> 
                        <div>查询类型：</div>
                        <Dropdown overlay={
                                <Menu>      
                                    <Menu.Item onClick={()=>onSelectDropdown('雨情数据')}>
                                        <div > 雨情数据 </div>
                                    </Menu.Item>  
                                    <Menu.Item onClick={()=>onSelectDropdown('水情数据')}>
                                        <div > 水情数据 </div>
                                    </Menu.Item>  
                                </Menu>
                                } placement="bottomLeft">
                                    <Button type='default'>{activeMenuName}</Button>
                        </Dropdown>
                    </div>
                    <Button type="default" shape="round"  onClick={onSearchTable}  size='default' icon={<SearchOutlined />}/>
                </div>
                <div className='top-right'>  
                    <div className='top-title'>历史数据查询</div> 
                </div> 
            </div>
            <div className='body-bottom-div'>  
                <Table dataSource={dataSource} columns={columns} pagination={false}  loading={isLoading}   />  
                {/* <Table dataSource={dataSource} columns={columns}  id="outTable-div" pagination={false} style={{'display':"none"}}/>   */}
                {/* <img src={bgEmpty} className="empty-img-div" style={{display:isLoading ? 'block' : 'none'}} /> */}
            </div>
        </div>
    )
}

export default DayRainForm;