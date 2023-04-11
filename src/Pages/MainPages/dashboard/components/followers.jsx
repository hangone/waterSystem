import React, { useState, useEffect } from 'react';
import { Spin } from 'antd'
import UserList from '../../../components/userList'
import * as Api from '../../../api'


const Followers = ({username}) => {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    Api.getfollowers(username).then(list => {
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

export default Followers
