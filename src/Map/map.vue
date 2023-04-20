<template><div class="subMap" ref="subChartMap"></div></template>

<script>

import * as Echarts from 'echarts'
import { diseaseStatus } from './shnaghai'
import { subInitGeo, subInitSeries } from './format'
const newMaoData = {
  type: 'FeatureCollection',
  features: [
  ],
  UTF8Encoding: true
}
export default {
  name: 'ChartMap',
  title: '地图模块',
  props: {
    // 要显示的模块数组(默认上海市)
    mapArr: {
      type: Array,
      required: true,
      default: () => {
        return [
          '黄浦区',
          '徐汇区',
          '长宁区',
          '静安区',
          '普陀区',
          '虹口区',
          '杨浦区',
          '闵行区',
          '宝山区',
          '嘉定区',
          '浦东新区',
          '金山区',
          '松江区',
          '青浦区',
          '奉贤区',
          '崇明区'
        ]
      }
    },
    sanData: {
      type: Array,
      required: true,
      default: () => {
        return [
          { name: '黄浦区', value: [121.490317, 31.222771] },
          { name: '徐汇区', value: [121.43752, 31.179973] },
          { name: '长宁区', value: [121.4222, 31.22737] },
          { name: '静安区', value: [121.448224, 31.229003] },
          { name: '普陀区', value: [121.392499, 31.241701] },
          { name: '虹口区', value: [121.491832, 31.26097] },
          { name: '杨浦区', value: [121.522797, 31.270755] },
          { name: '闵行区', value: [121.375972, 31.111658] },
          { name: '宝山区', value: [121.489934, 31.398896] },
          { name: '嘉定区', value: [121.250333, 31.383524] },
          { name: '浦东新区', value: [121.567706, 31.245944] },
          { name: '金山区', value: [121.330736, 30.724697] },
          { name: '松江区', value: [121.223543, 31.03047] },
          { name: '青浦区', value: [121.113021, 31.151209] },
          { name: '奉贤区', value: [121.458472, 30.912345] },
          { name: '崇明区', value: [121.397516, 31.626946] }
        ]
      }
    },
    mapStyle: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 当前所在的页面
      routerName: '',
      // 地图json
      mapJsonData: [],
      // 地图
      mapChart: null,
      // 选中的名称
      selectName: '',
      // 弹框偏移量
      styles: {
        left: '290px',
        top: '66px'
      },
      // 上海模块大点json文件
      diseaseStatus: diseaseStatus,
      // 轮询定时器
      mTime: '',
      index: -1,
      timer: null
    }
  },
  computed: {
  },
  mounted() {
    // 设置不同页面地图的高度
    this.$refs.subChartMap.style.height = this.mapStyle.height
    this.init()
  },
  methods: {
    init() {
      // 初始化撒点坐标
      // 获取地图要展示的模块
      this.$nextTick(() => {
        // 当前所在的页面
        this.routerName = this.$route.name
        //    // 用于 经纬度转坐标轴 筛选条件
        // 跳转至学校页面，初始展示区级显示的坐标点位名称
        this.selectName = this.routerName === 'school' ? this.vux_currentSchoolName ? this.vux_currentSchoolName : this.sanData[0]?.name : this.sanData[0]?.name
        // 获取当前页面需要展示的模块json
        newMaoData.features = this.mapArr.map(element => {
          return (diseaseStatus.get(element))
        })
        this.mapJsonData = newMaoData
        let parmas = {
          // 地图名称
          // 市级地图默认取上海市
          // 其他地图默认取传入名称
          mapName: this.mapArr.length > 1 ? '上海市' : this.$route.query.currentDistrict,
          // 地图缩放比例大小
          // 依次为 市级地图、区级、校级
          mapZoom: this.routerName === 'home' ? 1.6 : this.routerName === 'area' ? 1.4 : 1.4,
          // 地图偏移量
          left: this.routerName === 'home' ? 130 : 'center',
          // 只有市级页面可以单独选中
          selectedMode: this.routerName === 'home' && true,
          // 鼠标悬浮地图背景样式
          areaColor: this.routerName === 'home' ? new Echarts.graphic.LinearGradient(
            0, 0, 1, 1, // 4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
            [
              { offset: 1, color: '#0985FF' },
              { offset: 0.8, color: '#69C0FF' },
              { offset: 0.2, color: '#2868D8' }
            ]
          ) : '#0b2B54'
        }
        this.initSubMap(parmas)
      })
    },
    // 地图初始化
    initSubMap(parmas) {
      const _this = this
      const { mapJsonData, sanData } = _this
      _this.mapChart = Echarts.init(this.$refs.subChartMap)
      // 注册地图
      Echarts.registerMap(parmas.mapName, mapJsonData)
      // 实例配置项与数据
      _this.mapChart.setOption({
        geo: subInitGeo(parmas, sanData),
        series: subInitSeries(parmas, _this.convertData(sanData))
      })
      // 初始化
      // 给弹框赋值 坐标轴（弹框偏移量）
      _this.getPixelArrToStyle()
      // 刷新页面初始化地图高亮选中
      _this.mapChart.dispatchAction({
        type: 'geoSelect',
        geoIndex: 0,
        name: _this.selectName
      })

      // 轮询定时器
      // _this.mapActive()
      // 捕捉georoam事件，使下层的geo随着上层的geo一起缩放拖曳
      _this.mapChart.on('georoam', function (params) {
        var option = _this.mapChart.getOption()// 获得option对象
        if (params.zoom != null && params.zoom !== undefined) { // 捕捉到缩放时
          option.geo[0].zoom = option.geo[2].zoom// 下层geo的缩放等级跟着上层的geo一起改变
          option.geo[0].center = option.geo[2].center// 下层的geo的中心位置随着上层geo一起改变
          option.geo[1].zoom = option.geo[2].zoom// 下层geo的缩放等级跟着上层的geo一起改变
          option.geo[1].center = option.geo[2].center// 下层的geo的中心位置随着上层geo一起改变
        } else { // 捕捉到拖曳时
          option.geo[0].center = option.geo[2].center// 下层的geo的中心位置随着上层geo一起改变
          option.geo[1].center = option.geo[2].center// 下层的geo的中心位置随着上层geo一起改变
        }
        _this.mapChart.setOption(option)// 设置option
      })
      // // 绑定区点击事件
      _this.mapChart.on('click', function (e) {
        // 防止重复点击
        if (_this.selectName === e.name) {
          return false
        }
        // 市级地图点击事件---------------------------------
        // 点击 图标、模块 都可触发点击事件---------------------------------
        if (_this.routerName === 'home') {
          _this.mapChart.dispatchAction({
            type: 'geoSelect',
            geoIndex: 0,
            name: e.name
          })
          // 点击的区域名称
          _this.selectName = e.name
          // 坐标点转为x，y偏移量
          _this.getPixelArrToStyle()
          _this.$refs.cityPopup.handleOpenPopup()
        } else {
          // 区级&校级地图点击事件---------------------------------
          // 只能点击图标触发点击事件---------------------------------
          if (e.componentType === 'series') {
            // 点击的区域名称
            _this.selectName = e.name
            // 坐标点转为x，y偏移量
            _this.getPixelArrToStyle()
            if (_this.routerName === 'area') _this.$refs.areaPopup.handleOpenPopup()
            if (_this.routerName === 'school') _this.$refs.schoolPopup.handleOpenPopup()
          }
        }
      })
    },
    // 地图撒点遍历参数
    convertData(data) {
      let res = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].name) {
          res.push({
            name: data[i].name,
            value: data[i].value,
            isAccess: data[i].isAccess === 'true'
          })
        }
      }
      return res
    },
    // 给弹框赋值 坐标轴（弹框偏移量）
    getPixelArrToStyle() {
      const _this = this
      const { routerName } = _this
      let convertToPixelArr = this.handleConvertToPixel()
      // ------------------------------学校地图偏移量点位不对---问题待修复---------------------------------------------------------------------
      if (convertToPixelArr) {
        if (routerName === 'school') {
          //  根据布局计算偏移量
          _this.styles.left = (parseInt(convertToPixelArr[0]) - 4) + 'px'
          //    根据布局计算偏移量
          _this.styles.top = (parseInt(convertToPixelArr[1]) - 65) + 'px'
        } else {
          //  根据布局计算偏移量
          _this.styles.left = (parseInt(convertToPixelArr[0]) - 5) + 'px'
          //    根据布局计算偏移量
          _this.styles.top = (parseInt(convertToPixelArr[1]) - 78) + 'px'
        }
      }
    },
    // 经纬度转坐标轴
    handleConvertToPixel() {
      const _this = this
      const { sanData, mapChart, selectName } = _this
      // 遍历坐标系数组
      // 根据名称查对应地区的经纬度
      if (!selectName) return
      let newSanData = sanData.map(item => {
        if (selectName === item.name) return item.value || []
      }).filter(Boolean)
      // 经纬度转为x，y偏移量
      return mapChart.convertToPixel('geo', newSanData[0])
    }
  },
  watch: {
    sanData: function (val) {
      this.mapChart && this.mapChart.dispose()
      this.mapChart = null
      // 当sanData值发生变化时，重新执行
      this.init()
    }
  },
  beforeDestroy() {
    const _this = this
    if (!_this.mapChart) {
      return
    }
    this.$store.commit('set_comparison', [])
    _this.mapChart && _this.mapChart.dispose()
    _this.mapChart = null
  }
}
</script>

<style scoped lang="scss">
.subMap {
  width: 100%;
  height: 100%;
  position: relative;
  // background: #04280c;
  background: transparent;

  .tiny_campus {
    position: absolute;
    left: 19px;
    width: 100px;
    height: 100px;
    background-image: url("~@/assets/images/tiny_campus.png");
    background-size: 100% 100%;
  }

  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .popup {
    transition: 0.5s all;
  }
}
</style>
