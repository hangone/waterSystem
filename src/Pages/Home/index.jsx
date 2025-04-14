import React, { useEffect, useState, Suspense } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import DocumentTitle from 'react-document-title'
import { getLogout } from 'Services/User/user'
import Common from 'Common'

// 引入兄弟传值模块
import PubSub from 'pubsub-js'

// 引入nanoid随机值模块
import { nanoid } from 'nanoid'

// AnimatedRouter组件, 替换Switch组件
//import AnimatedRouter from 'react-animated-router';

import { Menu, Button, Dropdown } from 'antd'

import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  BranchesOutlined,
  SlackOutlined,
  AimOutlined,
  DownCircleOutlined,
  UpCircleOutlined,
  MessageOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import './index.css'
import { subRouterMap } from 'Router/index'
import { formatDate } from 'Utils'

import fgLogo1 from '../../Assets/images/home/fg-logo2.png'

const { SubMenu } = Menu

function Home(props) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTitle, setActiveTitle] = useState(null)
  const defaultTitle = '清逸智慧水系统'

  const [defaultSidebarMenu, setDefaultSidebarMenu] = useState([])
  const [preSidebarMenu, setPreSidebarMenu] = useState('homePage')

  const [defaultSidebarItem, setDefaultSidebarItem] = useState('')
  const [nowTime, setNowTime] = useState('')
  // 页面定时器
  let TTimer = null
  // 当前路由
  const location = useLocation()
  const showRoutes = ['/homePage']
  const hiddenShowRoutes = [
    '/home/homePage/minuteChange',
    '/home/homePage/mainChange',
  ]
  // 显示更多选项菜单
  const [isShowTitleMenu, setIsShowTitleMenu] = useState(false)
  // 显示更多选项文字
  const [isShowTitleText, setIsShowTitleText] = useState(false)
  // 是否有权限修改数据
  const [isHaveAuth, setIsHaveAuth] = useState(false)

  // 页面加载
  useEffect(() => {
    // 一、与主平台互联的部分

    // 1.监听parent的iframe传递的数据（2s内会传递）
    window.addEventListener(
      'message',
      function (e) {
        // console.log('iframe child listen.....',typeof(e.data),e.data);
        // console.log("child收到的token数据是",e)

        // 如果数据长度大于50,则默认可能是token
        if (
          e.data.length > 80 &&
          e.data.startsWith('ey') &&
          e.data.includes('.')
        ) {
          localStorage.setItem('water_token', e.data)
          // console.log('已经获取token.....',e.data);
        }
        // 如果长度是1,则是pid
        if (typeof e.data == 'number' && (e.data == 1 || e.data == 0)) {
          localStorage.setItem('water_pid', e.data)
          // console.log('已经获取pid.....',e.data);
          // 如果pid是0,当前用户是管理员,有权限访问
          if (e.data == 0) setIsHaveAuth(true)
        }
      },
      false
    )

    // 2.运行检测，如果5秒内还未检测到token,则消除当前的token数据，并通知父窗口进行跳转
    setTimeout(() => {
      let token = localStorage.getItem('water_token')
      if (!token) {
        // 清空当前域的token
        getLogout()
        // 向parent的iframe传递token;
        window.parent.postMessage('token失效', '*')
      }
    }, 5000)

    // 二、当前项目运行部分

    // 1.显示信息初始化
    // （1.初始化窗口大小
    if (window.innerWidth < 1200) {
      setCollapsed(true)
    }
    // （2.初次获取当前时间
    let time = formatDate(new Date(), 'yyyy年MM月dd日 HH:mm:ss')
    setNowTime(time)
    TTimer = setInterval(() => {
      const time = formatDate(new Date(), 'yyyy年MM月dd日 HH:mm:ss')
      setNowTime(time)
    }, 1000)

    // 2.初始化其它项数据
    // （1.初始化头部显示项
    sessionStorage.setItem('water_isShowTitle', false)
    PubSub.publish('water_titleMenu', { isShowTitle: false })
    // （2.初始化侧边栏显示项
    setDefaultSidebarMenu(['homePage'])
    setDefaultSidebarItem('mainChange')
    props.history.push('/home/homePage/mainChange')

    return () => {
      //  清除定时器
      if (TTimer) {
        clearInterval(TTimer)
      }
      // 取消消息订阅
      PubSub.unsubscribe('water_titleMenu')
    }
  }, [])
  // 监听路由的变化,决定是否可以使用路由
  useEffect(() => {
    // 从对象字符串中转换成对象
    if (location.pathname && location.pathname.includes(showRoutes[0])) {
      let isHidden = false
      hiddenShowRoutes.forEach((item) => {
        if (location.pathname.includes(item)) {
          isHidden = true
        }
      })
      if (isHidden) {
        setIsShowTitleText(false)
      } else {
        setIsShowTitleText(true)
      }
    } else {
      setIsShowTitleText(false)
    }

    // 监听当前的路由变化(改变标题)
    let route = window.location.href
    subRouterMap.some((item, index) => {
      if (route.endsWith(item.path)) {
        setActiveTitle(item.title)
      }
    })
  }, [location])
  // 监听对应节点的变化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setCollapsed(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [window])

  // 切换折叠栏
  const toggleCollapsed = () => {
    if (collapsed) {
      setDefaultSidebarMenu([preSidebarMenu])
    } else {
      setDefaultSidebarMenu([])
    }
    // 发布信息：侧边栏被修改
    PubSub.publish('water_leftcollapsed', { collapsed: !collapsed })
    setCollapsed(!collapsed)
  }

  // 处理路由数据： 解析出菜单与子菜单
  const parseRoute = (path) => {
    let sidebarItem = path.replace(/(\/(\w+))+[\/]+/gi, '')
    let sidebarMenu = path.replace(/^[\/][\w]+[\/]/gi, '')
    sidebarMenu = sidebarMenu.replace('/' + sidebarItem, '')
    return [sidebarMenu, sidebarItem]
  }

  // 选中侧边栏的菜单项
  const onOpenChange = (e) => {
    //
    setDefaultSidebarMenu([e[1]])

    if (e[1]) setPreSidebarMenu(e[1])
  }
  // 选中侧边栏的子项
  const onSelect = (e) => {
    console.log("🚀 ~ onSelect ~ e:", e)
    const { key } = e
    console.log("🚀 ~ onSelect ~ key:", key)
    subRouterMap.some((item) => {
      if (item.path.endsWith(key)) {
        console.log("🚀 ~ subRouterMap.some ~ item:", item)
        sessionStorage.setItem('water_sidebarItem', item.path)
        // 数据不能响应式变化
        const menuList = parseRoute(item.path)
        setDefaultSidebarItem(menuList[1])
        console.log("🚀 ~ subRouterMap.some ~ path:", item.path)
        props.history.push(item.path)
        return false
      }
       
    })
  
  }

  // 大屏展示
  const handleBigPage = () => {
    window.location.href = Common.dumpWebPages.bigPage
  }
  // 使用帮助
  const handleDisplay = () => {
    props.history.push('/home/statementPage/help')
  }
  // 更多选项
  const handleAddMenu = () => {
    const nowShow = isShowTitleMenu

    if (nowShow) {
      // 发布信息, 关闭
      PubSub.publish('water_titleMenu', { isShowTitle: false })
      sessionStorage.setItem('water_isShowTitle', false)
      setIsShowTitleMenu(false)
    } else {
      // 发布信息，开启
      PubSub.publish('water_titleMenu', { isShowTitle: true })
      sessionStorage.setItem('water_isShowTitle', true)
      setIsShowTitleMenu(true)
    }
  }
  // 修改数据
  const changeData = () => {
    props.history.push('/home/handleData/currentReset')
  }

  return (
    <DocumentTitle title={activeTitle ? activeTitle : defaultTitle}>
      <div className="home-div">
        <div className={'left-div' + (collapsed ? ' hidden' : '')}>
          <div className={'logo-div ' + (collapsed ? ' hidden' : '')}>
            <img src={fgLogo1} className="fg-logo1" />
          </div>
          <Menu
            openKeys={defaultSidebarMenu}
            selectedKeys={defaultSidebarItem}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            onOpenChange={onOpenChange}>
            <SubMenu
              key="homePage"
              icon={<AppstoreOutlined />}
              title="基础功能"
              onClick={onSelect}>
              <Menu.Item key="mainChange">背景介绍</Menu.Item>
              <Menu.Item key="hourWaterForm">位置分布</Menu.Item>
              <Menu.Item key="dayWaterForm">图表分析</Menu.Item>
              <Menu.Item key="rainChange">3D模型</Menu.Item>
              <Menu.Item key="whouseChange">实时数据</Menu.Item>
            </SubMenu>
            <SubMenu key="waterPage" icon={<BranchesOutlined />} title="问 AI" onClick={onSelect} >
                          <Menu.Item key="waterQuality">大模型系统</Menu.Item>
            </SubMenu> 
            {/* <SubMenu key="rainPage" icon={<SlackOutlined />} title="雨情报表"  onClick={onSelect} >
                            <Menu.Item key="hourRainForm">分时雨量明细报表</Menu.Item> 
                            <Menu.Item key="dayRainForm">分日雨量明细报表</Menu.Item> 
                            <Menu.Item key="yearRainForm">全年雨量明细报表</Menu.Item>
                            <Menu.Item key="yearDayRainForm">全年逐日雨量明细报表</Menu.Item>
                            </SubMenu>  */}
            {/* <SubMenu key="rainChart" icon={<PieChartOutlined />} title="雨量明细图"  onClick={onSelect} > 
                            <Menu.Item key="dayRainChart">日雨量明细图</Menu.Item>
                            <Menu.Item key="yearRainChart">年雨量明细图</Menu.Item> 
                        </SubMenu>  */}
            <SubMenu
              key="handleData"
              icon={<TagsOutlined />}
              title="数据查询"
              onClick={onSelect}>
              <Menu.Item key="minuteChange">全国水质数据</Menu.Item>
              {/* <Menu.Item key="waterChange">图表可视化</Menu.Item>
              <Menu.Item key="historySearch">历史数据查询</Menu.Item> */}
            </SubMenu>
          </Menu>
          {isHaveAuth ? (
            <div
              id="fix-data"
              className="float-tag-div"
              title="数据修正"
              onClick={() => changeData()}>
              <AimOutlined />
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="content-div">
          {/* <img src={bgImg} className='bg-img' /> */}
          <div className="header-div">
            <div className="header-left">
              <Button type="default" onClick={toggleCollapsed}>
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
                )}
              </Button>

              <div className="useable-div" onClick={handleDisplay}>
                使用说明
              </div>
              {/* <div className='useable-div' onClick={handleHelp}>使用帮助</div> */}
              {isShowTitleText ? (
                <div
                  className="useable-div showmore-div"
                  onClick={handleAddMenu}>
                  <span>更多选项</span>
                  {isShowTitleMenu ? (
                    <UpCircleOutlined />
                  ) : (
                    <DownCircleOutlined />
                  )}
                </div>
              ) : (
                ''
              )}
              <div className="useable-div fix-time">当前时间：{nowTime}</div>
            </div>
            <div className="header-right">{/* ... */}</div>
          </div>
          <div className="body-div">
            <Suspense fallback={<></>}>
              {subRouterMap.map((item, index) => {
                return (
                  <Route
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    key={index}></Route>
                )
              })}
            </Suspense>
            <Redirect to="/home/homePage/mainChange" />
          </div>
        </div>
      </div>
    </DocumentTitle>
  )
}

export default Home
