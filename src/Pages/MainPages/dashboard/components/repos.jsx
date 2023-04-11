import React, { useState, useEffect } from 'react';
import { Spin } from 'antd'
import Column from '../../../components/column'
import * as Api from '../../../api'


const Repos = ({ username }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    Api.getRepos(username).then(list => {
      setList(list)
      setLoading(false)
    })
  }, [username])
  return (
    <Spin spinning={loading} >
      <Column data={list} id="column" />
    </Spin>
  )
}

export default Repos