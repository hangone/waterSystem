import React,{useEffect,useState,useRef} from 'react' ;
import { DatePicker  , Button,Modal  ,Menu, Dropdown ,Spin , Input, Form} from 'antd';
import moment from 'moment'
import { SearchOutlined,LoadingOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import { updateOutflowBlockData } from 'Services/Home/reset';
import { MessageTool } from 'Components/Tools/MessageTool';   
import { ceilHalfMinute,changeMomentType} from 'Utils' 
 
import './index.css';
  

const { confirm } = Modal;
const formItemLayout = {
  labelCol: {
      xs: {
      span: 12,
      },
      sm: {
      span: 12,
      },
  },
  wrapperCol: {
      xs: {
      span: 12,
      },
      sm: {
      span: 12,
      },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
      xs: {
      span: 24,
      offset: 0,
      },
      sm: {
      span: 16,
      offset: 8,
      },
  },
};

function DayRainForm(){  
    // 端点编码
    let typeList  = []  
    let afterObj =  {stcd:''}
    // 默认后缀
    const afterFix =  ':00';
    // 初始化日期
    const [searchTxtObj,setSearchTxtObj] = useState({ })   
    const [labelValue,setLabelValue] = useState('2022-08-04 08:00 ~ 2022-09-04 09:00')   
    // 默认日期
    // const [defaultStartValue,setDefaultStartValue] = useState(moment(' 00:00:00', 'HH:mm:ss'))
    // const [defaultEndValue,setDefaultEndValue] = useState(moment(moment().format("HH:mm:ss "), 'HH:mm:ss'))
    

    const [defaultStartValue,setDefaultStartValue] = useState(
      moment(ceilHalfMinute(changeMomentType(moment,'YYYY-MM-DD HH:mm:ss').subtract(60,'minutes').format("YYYY-MM-DD HH:mm:ss")),'YYYY-MM-DD HH:mm:ss')
    )
    const [defaultEndValue,setDefaultEndValue] = useState(
      moment(ceilHalfMinute(changeMomentType(moment,'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD HH:mm:ss")),'YYYY-MM-DD HH:mm:ss')
    )

  // 表格是否扩展
  const [activeMenuName,setActiveMenuName] = useState('出库流量' ) 

  // 用户信息 
  const [data, setData] = useState([]);
  // 是否显示表格信息
  const [isShowTable,setIsShowTable] = useState(false);
  // 表单信息
  const [form] = Form.useForm(); 
 
 
  // 是否有数据 
  const [editDataObj,setEditDataObj] = useState([])
  const [isSubmit,setIsSubmit] = useState(false)
      
    // 初始化加载
    useEffect(()=>{
        try{ 
  
            // // 设置默认日期 ，开启搜索(日期已经有默认值)
            // // YYYY-MM-DD HH:mm:ss
            let startTime = ceilHalfMinute(changeMomentType(moment,'YYYY-MM-DD HH:mm:ss').subtract(60,'minutes').format("YYYY-MM-DD HH:mm:ss"));
            // 设置成当前具体时间 
            let endTime = ceilHalfMinute(changeMomentType(moment,'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD HH:mm:ss"));
  
            setLabelValue(startTime + ' ~ ' + endTime) 
            setSearchTxtObj( {  startTime,endTime  })
 
        }catch(err){
            console.log("出现异常",err)
            MessageTool('系统出现异常！请刷新重试','error')
        } 
    },[])
  
    // 选择日期
    const onSelectStartDate = (e,dateString )=>{  
      const startTime = dateString ? ceilHalfMinute(dateString ) : dateString;  
      const endTime =  searchTxtObj.endTime 
      // 改变默认的日期  
      setDefaultStartValue(moment(startTime,"YYYY-MM-DD HH:mm:ss")) 
 
      setLabelValue(startTime + ' ~ ' + endTime)
      setSearchTxtObj( {  startTime,endTime })
    }
    const onSelectEndDate = (e,dateString)=>{  
      const startTime =  searchTxtObj.startTime 
      const endTime = dateString ? ceilHalfMinute(dateString ) : dateString;  
      // 改变默认的日期  
      setDefaultEndValue(moment(endTime,"YYYY-MM-DD HH:mm:ss")) 
 
      setLabelValue(startTime + ' ~ ' + endTime)
      setSearchTxtObj( {  startTime,endTime })
    } 
    // 设置表格扩展类型
    const onSelectDropdown = (name)=>{  
        switch(name){
            case '出库流量': 
                setActiveMenuName("出库流量")  
                break; 
            default:
                console.log("选错了") 
                break;
        } 
   }   
  

   // 提交数据
   const updateData = (values) =>{ 
      if(isSubmit){
        MessageTool("当前已经在提交表单数据！",'warning')
        return
      }
      setIsSubmit(true)
      let {new_data} = values
      let data = {
        "out": parseFloat(new_data),
        "startTime":searchTxtObj.startTime,
        "overTime":searchTxtObj.endTime
      }

      updateOutflowBlockData(data,{},'post').then(res=>{ 
        console.log("返回的结果是",res)
         if(res.message == '修改成功！'){
           MessageTool('修改数据成功!','success');
         }else{ 
           MessageTool('修改数据失败!','error');
         } 
          setIsSubmit(false)
      }).catch(err=>{ 
          console.log('修改数据出现异常:', err);
          MessageTool('修改数据出现异常!','error');  
          setIsSubmit(false)
      })
   }

    //  确认提交（修改的表单信息）
    const onFinish = (values) => {  
      // 验证提交的数据
      confirm({
        icon: <ExclamationCircleOutlined />,
        centered:true,
        content: "请确认是否提交修改当前时间段的出库流量？",
        onOk() {
          // 表单验证
          // let new_data = values.new_data;
          let {new_data} = values
          // 验证日期是否正确
          if (searchTxtObj.startTime >= searchTxtObj.endTime){
            MessageTool("开始日期不能大于结束日期！",'warning')
            return;
          }
          // 验证结束日期是否大于当前时间
          let currentTime = ceilHalfMinute(changeMomentType(moment,'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD HH:mm:ss"))
          if(currentTime < searchTxtObj.endTime ){
            MessageTool("结束日期不能大于当前日期！",'warning')
            return;
          } 
          // 验证数据是否正确 
          if(!new_data || new_data.replace(" ","").length == 0){
            MessageTool("填写的数据不能为空！",'warning')
            return;
          }
          if(!/^[\d|\.]+$/gi.test(new_data)){
            MessageTool("填写的数据有非法字符！",'warning')
            return;
          }
 
          updateData(values);
        },
        onCancel() {},
      }); 
    };


    return (
        <div id='current-div' className='dayRainChart-div commTable-div'>
            <div className='body-top-div'>
                <div className='top-left'>  
                    <div className='date-div table-div' style={{width:'19rem'}}>
                        <span>开始时间：</span> 
                        <DatePicker  allowClear={false} inputReadOnly={true}  onChange={onSelectStartDate} picker="day" showTime value={defaultStartValue}   placeholder="请选择"/>
                    </div>     
                    <div className='date-div table-div' style={{width:'19rem'}}>
                        <span>结束时间：</span> 
                        <DatePicker  allowClear={false} inputReadOnly={true}  onChange={onSelectEndDate} picker="day" showTime  value={defaultEndValue}   placeholder="请选择"/>
                    </div>              
                    
                    <div className='table-mode-div'> 
                        <div>修改类型：</div>
                        <Dropdown overlay={
                                <Menu>      
                                        <Menu.Item onClick={()=>onSelectDropdown('出库流量')}>
                                            <div > 出库流量 </div>
                                        </Menu.Item>   
                                </Menu>
                                } placement="bottomLeft">
                                    <Button type='default'>{activeMenuName}</Button>
                        </Dropdown>
                    </div>
                  </div>
                <div className='top-right'>  
                    <div className='top-title'>今日数据修正</div> 
                </div> 
            </div> 
            <div className='body-bottom-div'>   
                 <Form id='edit-div' {...formItemLayout} form={form} className="theme-box"
                 name="register" onFinish={onFinish} scrollToFirstError>   
                    <Form.Item name={'new_data'} label={labelValue}  className="form-item" >
                        <Input autocomplete="new-password" placeholder='请输入新数据'/>
                    </Form.Item> 
                     <Form.Item {...tailFormItemLayout} className="submitBtn"> 
                        <Button type="primary" htmlType="submit" disabled={isSubmit}>
                              提交修改 
                              { isSubmit  ? <Spin indicator={ <LoadingOutlined />}/> :''  }
                        </Button>  
                     </Form.Item>  
                 </Form> 
            </div>
        </div>
    )
}

export default DayRainForm;