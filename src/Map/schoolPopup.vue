<template>
  <!--弹窗-->
  <div class="layer" ref="layer" v-show="isShowPopup">
    <div class="del_icon" @click="handleDelPopup">+</div>
    <div class="layer_box">
      <div class="header">
        <div class="header_left">
          <div class="header_color_box"></div>
          <div>{{selectName}}</div>
        </div>

      </div>
      <div class="content">
        <div class="content_left">
          <div class="content_item">年级：{{dataObj.gradeNum}}</div>
          <div class="content_item">班级：{{dataObj.classNum}}</div>
        </div>
        <div class="content_right">
          <div class="content_item"><img src="@/assets/images/flag_1.png" alt=""></div>
          <div class="content_item" v-if="schoolObj.isAdd" @click="handleClickCancel">取消对比</div>
          <div class="content_item" v-if="!schoolObj.isAdd" @click="handleClickAdd">加入对比</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vuexMixin from '@/mixin/useVuexMixin'
import { selectAccess } from '@/api'

export default {
  name: 'SchoolPopup',
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
      schoolObj: {},
      dataObj: [],
      falg: true
    }
  },
  computed: {
  },

  mounted () {
  },
  methods: {
    handleOpenPopup () {
      if (!this.isShowPopup) {
        this.isShowPopup = true
      }
    },
    handleDelPopup () {
      this.isShowPopup = false
    },
    // 加入对比
    handleClickAdd () {
      const { schoolObj } = this
      let newString = this.vux_comparisonList.join(',')
      if (newString.includes(schoolObj.schoolCode)) {
        // 判断数组是否已添加
        return
      }
      for (let i = 0; i < this.vux_sanData.length; i++) {
        if (schoolObj.schoolCode === this.vux_sanData[i].schoolCode) {
          let newList = [...this.vux_comparisonList, schoolObj.schoolCode]
          this.$store.commit('set_comparison', newList)
          this.vux_sanData[i].isAdd = true
          return
        }
      }
    },
    // 取消对比
    handleClickCancel () {
      const { schoolObj } = this
      if (this.vux_comparisonList.length <= 1) {
        this.message({
          type: 'error',
          content: '至少加入一条对比数据'
        })
        return
      }
      for (let i = 0; i < this.vux_sanData.length; i++) {
        if (schoolObj.schoolCode === this.vux_sanData[i].schoolCode) {
          let newList = this.vux_comparisonList.map((item) => {
            if (item !== schoolObj.schoolCode) { return item }
          }).filter(Boolean)
          this.$store.commit('set_comparison', newList)
          this.vux_sanData[i].isAdd = false
          return
        }
      }
      // let newIndex = this.vux_sanData.findIndex((item) => {
      //   return item.schoolCode === schoolObj.schoolCode
      // })
      // this.vux_sanData[newIndex].isAdd = false
      // this.schoolObj = this.vux_sanData[newIndex] || {}

      // let newList = this.vux_comparisonList.map((item) => {
      //   if (item !== schoolObj.schoolCode) { return item }
      // }).filter(Boolean)
      // this.$store.commit('set_comparison', newList)
    },
    // 市级、区级、校级接入情况统计
    async getSelectAccess () {
      // 进入校级点击图表时不请求接口
      if (!this.vux_selectActive) return
      try {
        const obj = {
          accessAreaNum: 0,
          accessShoolNum: 0,
          classNum: 0,
          gradeNum: 0,
          interfaceNum: 0,
          ioTDeviceNum: 0,
          notAccessAreaNum: 0,
          notAccessShoolNum: 0,
          offeringNum: 0,
          otherRoleNum: 0,
          parentNum: 0,
          studentNum: 0,
          teacherNum: 0
        }
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
            classNum: result ? result.classNum || 0 : 0
          }
          // this.$emit('doneAccess', result)
          Object.keys(Object.assign(obj, result)).map(item => {
            obj[item] = +obj[item]
          })
          this.$store.commit('set_school_currentSchoolInfo', {
            orgCode: this.schoolObj.schoolCode,
            schoolName: this.selectName
          })
          this.$store.commit('set_School_CurrentAccessInfo', obj)
        }
        this.$store.commit('set_selectActive', false)
      } catch (e) {
        console.log(e)
      }
    }

  },
  watch: {
    selectName: {
      immediate: true,
      handler (val) {
        this.$store.commit('set_current_school_name', val)
        let newIndex = this.vux_sanData.findIndex((item) => {
          return item.schoolName === val
        })
        if (!this.vux_comparisonList.length) {
          this.vux_sanData[newIndex].isAdd = true
          // 加入对比数组
          this.$store.commit('set_comparison', [this.vux_sanData[newIndex].schoolCode])
        }
        this.schoolObj = this.vux_sanData[newIndex] || {}
        this.$store.commit('set_current_school_name', val)
        // 切换学校时，从新请求接口，刷新弹窗数据
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

  z-index: 9999;
  width: 314px;
  height: 186px;
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
    margin: 25px 10px 10px 60px;
    .header {
      display: flex;
      justify-content: space-between;
      .header_left {
        display: flex;
        .header_color_box {
          width: 5px;
          height: 18px;
          background: #01d7e7;
          margin-right: 13px;
        }
      }
    }
    .content {
      display: flex;
      padding-left: 18px;
      margin-top: 18px;
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
      line-height: 25px;
      .content_left {
        margin-right: 18px;
        .content_item {
          padding-bottom: 12px;
        }
      }
      .content_right {
        cursor: pointer;
        color: #f59a23;
        img{
          margin-left: 24px;
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>
