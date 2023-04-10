import React, { useState, useEffect } from 'react'
import { Select, Table } from 'antd'
import { getWaterQualityData } from '../../../Services/waterQuality'
import { MessageTool } from '../../../Components/Tools/MessageTool'
import columns from '../../..//Pages//MainPages//HomePage//WaterQuality//formData//column'

const { Option } = Select;

const SearchAddress = ({ addressName, changeAddressName, changePosition }) => {
  const [positionList, setPositionList] = useState([]);

  const [dataSource, setDataSource] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const modifyValue = (val) => {
    return new Promise((resolve, reject) => {
      getWaterQualityData(val)
        .then((res) => {
          setDataSource(res.tbody)

          if (res.tbody.length > 0) {
            let modifyValue = res.tbody[0].province + res.tbody[0].section
            setIsLoading(false)
            resolve(modifyValue)
          }
        })
        .catch((error) => {
          console.error(error)
          setIsLoading(false)
          setDataSource([])
          MessageTool('数据获取失败!', 'error')
        })
    })
  }
  const onSearch = (val) => {
    modifyValue(val)
      .then((modifiedVal) => {
        let placeSearch = new window.AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: '南昌',
        })

        placeSearch.search(modifiedVal, (status, result) => {
          console.log(modifiedVal, status, result)
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
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setDataSource([])
        MessageTool('数据获取失败!', 'error')
      })
  }

  const debounce = (fn, time) => {
    let timerId = null;
    return function (val) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      timerId = setTimeout(() => {
        fn.call(this, val);
      }, time);
    };
  };

  const onChange = (id) => {
    for (const item of positionList) {
      const { name: itemName, id: itemId } = item;
      if (itemId === id) {
        const {
          location: { lng, lat },
        } = item;
        const position = { lng, lat };
        changePosition(position);
        changeAddressName(itemName);
      }
    }
  };

  return (
    <div>
      <Select
        value={addressName}
        style={{ width: 400 }}
        showSearch
        placeholder="请输入地址"
        onSearch={debounce((val) => onSearch(val), 300)}
        onChange={onChange}
        optionFilterProp="children"
      >
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
        scroll={{ y: 300, x: 800 }}
      />
    </div>
  );
};

export default SearchAddress;