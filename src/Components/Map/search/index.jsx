import React, { useState } from 'react'
import { Select, Table } from 'antd'
import { getWaterQualityData } from '../../../Services/waterQuality'
import { MessageTool } from '../../../Components/Tools/MessageTool'
import columns from '../../..//Pages//MainPages//HomePage//WaterQuality//formData//column'

const SearchAddress = ({ addressName, changeAddressName, changePosition }) => {
  const [positionList, setPositionList] = useState([])

  const { Option } = Select
  const [dataSource, setDataSource] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const modifyValue = (val) => {
    // Replace this with your own logic to modify the value

    getWaterQualityData(val)
      .then((res) => {
        setDataSource(res.tbody)
        console.log(res.tbody[0].section)
        let modifyValue = res.tbody[0].province+res.tbody[0].section
        setIsLoading(false)
        console.log(modifyValue)
        return modifyValue
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setDataSource([])
        MessageTool('数据获取失败!', 'error')
      })
    return val.toUpperCase()
  }
  const onSearch = (val) => {
    console.log(val)
    val = modifyValue(val) // added line
    let placeSearch = new window.AMap.PlaceSearch({
      pageSize: 10,
      pageIndex: 1,
      city: '南昌',
    })

    placeSearch.search(val, (status, result) => {
      console.log(val, status, result)
      if (status === 'complete' && result.info === 'OK') {
        const {
          poiList: { pois },
        } = result
        if (pois && Array.isArray(pois)) {
          setPositionList(pois)
          console.log(pois) // added console.log
        }
      }
    })
  }

  const debounce = (fn, time) => {
    let timerId = null
    return function (val) {
      if (timerId) {
        clearTimeout(timerId)
        timerId = null
      }
      timerId = setTimeout(() => {
        fn.call(this, val)
      }, time)
    }
  }

  const onChange = (event) => {
    if (event.keyCode === 13) {
      for (const item of positionList) {
        const { name: itemName, id: itemId } = item
        if (itemId === event.target.value) {
          const {
            location: { lng, lat },
          } = item
          const position = { lng, lat }
          changePosition(position)
          changeAddressName(itemName)
        }
      }
    }
  }

  return (
    <div>
      <Select
        value={addressName}
        style={{ width: 400 }}
        showSearch
        placeholder="请输入断面地址"
        onSearch={debounce((val) => onSearch(val), 300)}
        onChange={onChange}
        optionFilterProp="children">
        {positionList.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={true}
        loading={isLoading}
        style={{ width: '100%' }}
        scroll={{ y: 200, x: 400 }}
      />
    </div>
  )
}

export default SearchAddress

