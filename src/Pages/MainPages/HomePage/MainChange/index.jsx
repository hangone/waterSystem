import React, { useEffect, useState, useRef, Fragment } from 'react'
import { Spin } from 'antd'
import { MessageTool, MessageToolClear } from 'Components/Tools/MessageTool'
import {
  getWaterMinute1,
  getWaterMinute2,
  getWaterMinute3,
  getRainMinute1,
  getRainMinute2,
  getRainMinute3,
  getRainMinute4,
  getRainMinute5,
  getCapMinute1,
  getInflowMinute2,
  getOutflowMinute3,
} from 'Services/Home/minute'
import {
  changeDataLine,
  changeDataLine2,
  dateSort,
  judgeListData,
  stripDayUselessData,
  setDomInnerText,
} from 'Utils'
import { resetTableTitleWidth } from 'Utils/layoutreset'
import MapComponent from '../../../../Components/Map'

// 引入兄弟传值模块
import PubSub from 'pubsub-js'

// 引入时间模块
import moment from 'moment'

import * as echarts from 'echarts'
import Common from 'Common'
import { formatDate } from 'Utils'
import 'Assets/css/comm.css'
import './index.css'

import bgHome from '../../../../Assets/images/pic/bg-home.png'
import flagWater from '../../../../Assets/images/pic/flag-water.png'
import flagRain from '../../../../Assets/images/pic/flag-rain.png'
import { map } from 'leaflet'
import { Divider, Typography } from 'antd'

function WaterChange() {
  const { Title, Paragraph } = Typography;

  return (
    <div className="waterChange-div" style={{ 
      margin: '0 10px',
      height: '100%',
      position: 'relative',
      padding: '20px 0', // 减少上下边距
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* 主容器 */}
      <div style={{
        padding: '40px 5% 30px', // 调整上下内边距
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255,255,255,0.15)',
        maxWidth: '1400px',
        height: '100%',
        margin: '0 auto',
        position: 'relative',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        {/* 标题容器 */}
        <div style={{ 
          position: 'static',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          margin: '0 0 25px', // 移除负边距
          padding: '24px 5%', // 与主容器padding对齐
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px',
          boxSizing: 'border-box'
        }}>
          <Title style={{ 
            margin: 0,
            color: '#fff',
            padding: '0', // 移除文字内边距
            fontWeight: 500,
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', // 动态字号
            lineHeight: 1.2,
            textAlign: 'center',
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}>
            水环境可视化大模型系统
          </Title>
        </div>

        {/* 完整内容区域 */}
        <div style={{ 
          display: 'grid', 
          gap: '40px',  // 减少间距
          position: 'relative',
          zIndex: 50 
        }}>
          {/* 平台背景 */}
          <section style={{ marginTop: '-8px' }}> 
            <Title level={2} style={{ 
              color: '#fff',
              fontWeight: 500,
              marginBottom: '28px', 
              fontSize: '1.8rem',
              letterSpacing: '-0.5px'
            }}>
              平台背景
            </Title>
            <Paragraph style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '16px',
              lineHeight: 1.8,
              letterSpacing: '0.2px',
              maxWidth: '800px'
            }}>
              水环境可视化大模型系统的设计目标是通过物联网、云计算、大数据和人工智能等技术，建立智能化、数字化的水环境监测与管理服务平台，实现水环境的高效布控、智能监测和科学管理，全面提升水环境质量和水资源利用效率。
            </Paragraph>
          </section>

          {/* 平台特点 */}
          <section>
            <Title level={2} style={{ 
              color: '#fff',
              fontWeight: 500,
              marginBottom: '40px', 
              fontSize: '1.8rem',
              letterSpacing: '-0.5px'
            }}>
              平台特点
            </Title>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(250px, 1fr))',
              gap: '36px', 
              paddingBottom: '40px'
            }}>
              {/* 所有模块统一调整 */}
              <div style={{
                padding: '32px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.2)',
                minHeight: '320px'
              }}>
                <Title level={3} style={{ 
                  color: '#fff',
                  fontWeight: 500,
                  marginBottom: '16px', 
                  fontSize: '1.4rem'
                }}>
                  Web端架构
                </Title>
                <Paragraph style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '15px',
                  lineHeight: 1.6, 
                  letterSpacing: '0.1px'
                }}>
                  采用互联网行业内前沿的 React 开发框架，使用了阿里巴巴旗下蚂蚁集团的开源组件库 Antd、Axios 网络请求库、百度开源的 Echarts 数据可视化库，高德地图的 React-Amap 组件库等组件自主构建，能够根据实际需要进行自定义修改，可满足水环境监测与管理服务的一系列要求。
                </Paragraph>
              </div>

              {/* 数字孪生技术 */}
              <div style={{
                padding: '32px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.2)',
                minHeight: '320px'
              }}>
                <Title level={3} style={{ 
                  color: '#fff',
                  fontWeight: 500,
                  marginBottom: '20px',
                  fontSize: '1.4rem'
                }}>
                  数字孪生技术
                </Title>
                <Paragraph style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  letterSpacing: '0.1px'
                }}>
                  使用 Three.js 等 Web3D 技术在 Web 端平台的前端开发中构建水资源，河道的 3D 模型，并实时展示相关数据，可实现智能预警功能，以帮助运行管理部门进行快速处置，预防和降低水质问题对生态环境的影响，同时实现对水资源相关数据的可视化观测。
                </Paragraph>
              </div>

              {/* 硬件和云服务模块 */}
              <div style={{
                padding: '32px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.2)',
                minHeight: '320px'
              }}>
                <Title level={3} style={{ 
                  color: '#fff',
                  fontWeight: 500,
                  marginBottom: '20px',
                  fontSize: '1.4rem'
                }}>
                  硬件和云服务模块
                </Title>
                <Paragraph style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  letterSpacing: '0.1px'
                }}>
                  利用基于可编程的嵌入式芯片设计的树莓派和数字传感器设备模块及云端服务器网页接口实现数据传输，并整合了 Cloudflare Tunnel 技术实现外网访问，并使用 Python 语言和 Flask 轻量级的 Web 框架作为后端的开发支持，使得该项目具备远程监控的功能，具备低功耗、高性能和可靠性强的数据采集功能。
                </Paragraph>
              </div>

              {/* 数据分析模块 */}
              <div style={{
                padding: '32px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.2)',
                minHeight: '320px'
              }}>
                <Title level={3} style={{ 
                  color: '#fff',
                  fontWeight: 500,
                  marginBottom: '20px',
                  fontSize: '1.4rem'
                }}>
                  数据分析模块
                </Title>
                <Paragraph style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  letterSpacing: '0.1px'
                }}>
                  采用先进的深度学习算法等相关技术，对水资源监测过程中产生的大量数据进行处理分析，实现对水资源监测过程的实时监测、降低数据分析成本和提高数据的精度和可解释性、增加用户对处理过程的理解，从而真正实现数字化管理、提高处理效率和水环境质量。
                </Paragraph>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default WaterChange
