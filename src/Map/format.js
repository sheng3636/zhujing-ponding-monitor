export function subInitGeo (parmas, data) {
  return [
    { // 底层 地图配置
      show: true,
      map: parmas.mapName, // 地图类型。
      silent: true,
      zoom: parmas.mapZoom,
      roam: true,
      selectedMode: false, // 不让单独选中
      animation: false,
      aspectScale: 1,
      left: parmas.left,
      // left: 'center',
      top: 100,
      itemStyle: {
        // 区域样式
        areaColor: {
          colorStops: [
            {
              offset: 0,
              color: '#244987' // 0% 处的颜色

            },
            {
              offset: 1,
              color: '#244987' // 0% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        },
        borderWidth: 1, // 边框大小
        borderColor: '#AAD4FC', // 边框样式
        shadowColor: '#AAD4FC', // 阴影颜色
        shadowOffsetX: 0, // 阴影水平方向上的偏移距离
        shadowOffsetY: 0, // 阴影垂直方向上的偏移距离
        shadowBlur: 4 // 文字块的背景阴影长度
      }
    },
    { // 中间层 地图配置
      show: true,
      map: parmas.mapName, // 地图类型。
      silent: true,
      zoom: parmas.mapZoom,
      roam: true,
      selectedMode: false, // 不让单独选中
      animation: false,
      aspectScale: 1,
      left: parmas.left,
      top: 90,
      itemStyle: {
        areaColor: '#0b2B54',
        borderWidth: 3, // 边框大小
        borderColor: '#68D2F9', // 边框样式
        shadowColor: '#68D2F9', // 阴影颜色 120,
        shadowOffsetX: 0, // 阴影水平方向上的偏移距离
        shadowOffsetY: 0, // 阴影垂直方向上的偏移距离
        shadowBlur: 10 // 文字块的背景阴影长度
      }
    },
    { // 上层 地图配置
      show: true,
      map: parmas.mapName, // 地图类型。
      zoom: parmas.mapZoom,
      roam: true,
      animation: false,
      aspectScale: 1,
      left: parmas.left,
      top: 90,
      itemStyle: {
        // 区域样式
        areaColor: '#0b2B54',
        borderWidth: 1, // 边框大小
        borderColor: '#014B89', // 边框样式
        shadowColor: '#014B89', // 阴影颜色
        shadowOffsetX: 0, // 阴影水平方向上的偏移距离
        shadowOffsetY: 0 // 阴影垂直方向上的偏移距离
      },
      data: data,
      // selectedMode: true, // 让单独选中
      // 只有市级页面为  true
      selectedMode: parmas.selectedMode, // 让单独选中
      select: {
        label: {
          show: false
        },
        itemStyle: {
          color: '#2868D8', // 设置地图点击后的颜色
          areaColor: parmas.areaColor

          // areaColor: new echarts.graphic.LinearGradient(
          //   0, 1, 0, 0, // 4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
          //   [
          //     { offset: 1, color: '#0985FF' },
          //     { offset: 0.5, color: '#fff' },
          //     { offset: 0, color: 'rgba(40,104,216,0.2)' }
          //   ]
          // )

        }
      },
      // 选中状态下样式
      emphasis: {
        label: {
          show: false,
          color: '#ffffff'
        },
        itemStyle: {
          show: false,
          areaColor: parmas.areaColor
          // areaColor: new echarts.graphic.LinearGradient(
          //   1, 0, 0, 1, // 4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
          //   [
          //     { offset: 1, color: '#0985FF' },
          //     { offset: 0.2, color: '#0985FF' },
          //     { offset: 0.5, color: '#eee' },
          //     { offset: 0.9, color: 'rgba(40,104,216,0.2)' },
          //     { offset: 0, color: 'rgba(40,104,216,0.2)' }
          //   ]
          // )
        }
      }
    }
  ]
}
export function subInitSeries (parmas, data) {
  let symbolIcon = 'image://@/assets/images/map_point.png'
  let symbolActiveIcon = 'image://@/assets/images/map_point_action.png'
  let newArr = []
  data.forEach((item, index) => {
    const obj = { // 散点配置
      name: '图标',
      type: 'effectScatter',
      selectedMode: false, // 让单独选中
      coordinateSystem: 'geo',
      data: [],
      symbolSize: 17,
      distance: 10,
      symbolOffset: [0, -10],
      symbol: '',
      showEffectOn: 'emphasis',
      rippleEffect: { brushType: 'stroke' },
      hoverAnimation: true,
      itemStyle: {
        color: '#01D7E7',
        fontSize: '100px'
      }
    }
    obj.symbol = symbolIcon
    if (item.isAccess) obj.symbol = symbolActiveIcon
    obj.data[index] = item
    newArr.push(obj)
  })
  return newArr
}
