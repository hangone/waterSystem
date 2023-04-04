import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router  } from 'react-router-dom'; 
import {ConfigProvider} from 'antd'
import 'antd/dist/antd.css'; 
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
//引入默认的动画样式定义
import 'Assets/plugins/animate.css'; 

// 以下数据会应用于所有的组件中
import './Assets/css/default.css'; 
import './Assets/css/comm.css';
//import './Assets/css/comm.less'; 
import App from './App'; 

ReactDOM.render( 
    <Router> 
       <ConfigProvider locale={locale}>
          <App /> 
      </ConfigProvider>
    </Router>  ,
  document.getElementById('root')
);
 