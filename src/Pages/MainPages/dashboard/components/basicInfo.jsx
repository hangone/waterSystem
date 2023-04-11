
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Row, Col, Avatar } from 'antd';
import * as Api from '../../../api'
import './index.less'


const BasicInfo = ({ username }) => {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Api.getUserInfo(username).then(user => {
      setUser(user)
      setLoading(false)
    })
  }, [username])
  return (
    <Spin spinning={loading} >
      <div className="basicinfo">
        <Avatar size={64} src={user.avatar_url} icon={<UserOutlined />} style={{ backgroundColor: '#003e4a' }} alt={user.login}>{user.login}</Avatar>
        <h3 className="username">{user.login}</h3>
        <Row>
          <Col sm={6} md={24} lg={12} xl={12}>
            <i className="iconfont icon-ic-followers"></i>{user.followers}followers
          </Col>
          <Col sm={6} md={24} lg={12} xl={12}>
            <i className="iconfont icon-following"></i>{user.following}following
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={24} lg={24} xl={124}>
            <i className="iconfont icon-1301dizhi"></i>：{user.location}
          </Col>
          <Col sm={12} md={24} lg={24} xl={24}>
            <i className="iconfont icon-Email"></i>：{user.email}
          </Col>
          <Col sm={12} md={24} lg={24} xl={24}>
            <i className="iconfont icon-link"></i>：{user.blog}
          </Col>
        </Row>
      </div>
    </Spin>
  )
}

export default BasicInfo