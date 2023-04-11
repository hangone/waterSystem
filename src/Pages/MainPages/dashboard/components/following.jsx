import React, { useState, useEffect } from 'react';
import { Spin } from 'antd'
import UserList from '../../../components/userList'
import * as Api from '../../../api'


const Following = ({ username }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  useEffect(() => {
    setLoading(true)
    Api.getFollowing(username).then(list => {
      setTotal(list.length)
      setList(list.slice(0, 12))
      setLoading(false)
    })
  }, [username])
  return (
    <Spin spinning={loading}>
      <UserList users={list} size="large" />
    </Spin>
    
  )
}

export default Following