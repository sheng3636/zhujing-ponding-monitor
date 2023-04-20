<template>
  <!--弹窗-->
  <div class="layer" ref="layer" v-show="isShowPopup">
    <div class="layer_box">
      <div class="del_icon" @click="handleDelPopup">+</div>
      <div class="header">
        <div class="header_left">
          <div class="header_color_box"></div>
          <div  class="header_title" :title="selectName">{{selectName}}</div>
        </div>
        <div class="header_right" @click="handleRouterPage">
          查看详情
          <img src="@/assets/images/arrow_right.png" alt="">
        </div>
      </div>
      <div class="content">
        <div class="content_top">
          <div class="content_top_item">年级：{{dataObj.gradeNum}}</div>
          <div class="content_top_item">班级：{{dataObj.classNum}}</div>
          <div class="content_top_item">接入应用：{{dataObj.offeringNum}}</div>
          <div class="content_top_item">接入物联设备：{{dataObj.ioTDeviceNum}}</div>
        </div>
        <div class="content_bottom">
          <div class="content_bottom_item">注册教师：{{dataObj.teacherNum}}</div>
          <div class="content_bottom_item">注册家长：{{dataObj.parentNum}}</div>
          <div class="content_bottom_item">注册学生：{{dataObj.studentNum}}</div>
          <div class="content_bottom_item">注册其他人：{{dataObj.otherRoleNum}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectAccess } from '@/api'
import vuexMixin from '@/mixin/useVuexMixin'
import { getListItem } from '@/util/ArrayUtil.js'

export default {
  name: 'AreaPopup',
  title: '地图弹框',
  props: {
    selectName: {
      type: String,
      required: true,
      default: () => {
        return '111'
      }
    }
  },
  mixins: [vuexMixin],

  data () {
    return {
      isShowPopup: true,
      dataObj: {

      },
      schoolObj: {}

    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    getListItem: getListItem,
    handleOpenPopup () {
      if (!this.isShowPopup) {
        this.isShowPopup = true
      }
    },
    handleDelPopup () {
      this.isShowPopup = false
    },
    // 跳转至区级页面
    handleRouterPage () {
      let params = {
        currentNav: this.vux_currentNav.name,
        currentDistrict: this.vux_currentDistrict.name,
        currentCycle: this.vux_currentCycle.name
      }
      this.$router.push({ path: '/school', query: { ...params } })
    },
    // 市级、区级、校级接入情况统计
    async getSelectAccess () {
      try {
        const parameter = {
        // 周期切换
          dateCode: this.vux_currentCycle.value,
          // 学校撒点code
          orgCode: this.schoolObj.schoolCode,
          // 校区切换
          semesterCode: this.vux_currentNav.value
        }
        const { code, result } = await selectAccess(parameter)
        if (code === 0) {
          this.dataObj = {
            // 年级数量
            gradeNum: result ? result.gradeNum || 0 : 0,
            // 班级
            classNum: result ? result.classNum || 0 : 0,
            // 接入应用
            offeringNum: result ? result.offeringNum || 0 : 0,
            // 接入物联设备
            ioTDeviceNum: result ? result.ioTDeviceNum || 0 : 0,
            // 注册教师
            teacherNum: result ? result.teacherNum || 0 : 0,
            // 注册家长
            parentNum: result ? result.parentNum || 0 : 0,
            // 注册学生
            studentNum: result ? result.studentNum || 0 : 0,
            // 注册其他人
            otherRoleNum: result ? result.otherRoleNum || 0 : 0

          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  watch: {
    selectName: {
      immediate: true,
      handler (val) {
        // 拿到地图撒点名称，遍历item
        let newValue = this.vux_sanData.map((item) => {
          if (item.schoolName === val) { return item }
        }).filter(Boolean)
        this.schoolObj = newValue[0] || ''
        this.$store.commit('set_current_school_name', val)

        this.getSelectAccess()
      }
    }
  },
  beforeDestroy () {
  }
}
</script>

<style scoped lang="scss">
/*弹窗样式*/
.layer {
  position: absolute;
  z-index: 9998;
  width: 394px;
  height: 226px;
  background-image: url("~@/assets/images/map_popup.png");
  background-size: 100% 100%;
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  line-height: 25px;
  .del_icon{
    position: absolute;
    top: 0px;
    right: 10px;
    z-index: 9999;
    font-size: 30px;
    font-weight: 100;
    cursor: pointer;
    transform: rotateZ(45deg);
  }
  .layer_box {
    margin: 30px 20px 10px 80px;
    .header {
      display: flex;
      justify-content: space-between;
      .header_left {
        display: flex;
        width: 190px;
        .header_color_box {
          width: 5px;
          height: 18px;
          background: #01d7e7;
          margin-right: 13px;
        }
        .header_title{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .header_right {
        cursor: pointer;
        min-width: 90px;
        text-align: right;
        img {
          width: 8px;
          height: 14px;
        }
        &:hover {
          color: #01d7e7;
        }
      }
    }
    .content {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
      margin-top: 3px;
      .content_top {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .content_top_item {
          text-align: center;
          line-height: 32px;
          width: 140px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          margin-bottom: 3px;
        }
      }
      .content_bottom {
        display: flex;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
        .content_bottom_item {
          width: 145px;
          height: 32px;
          font-size: 14px;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
