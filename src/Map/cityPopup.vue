<template>
  <!--弹窗-->
  <div class="layer" ref="layer" v-show="isShowPopup">
    <div class="del_icon" @click="handleDelPopup">+</div>
    <div class="layer_box">
      <div class="header">
        <div class="header_left">
          <div class="header_color_box"></div>
          <div>{{ selectName }}</div>
        </div>
        <div class="header_right" @click="handleRouterPage">
          <div class="header_right" @click="handleRouterPage">
            查看详情
            <img src="@/assets/images/arrow_right.png" alt="">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="content_item">已接入学校: {{ dataObj.accessShoolNum }}</div>
        <div class="content_item">已注册教师: {{ dataObj.teacherNum }}</div>
        <div class="content_item">已注册学生: {{ dataObj.studentNum }}</div>
        <div class="content_item">已注册家长: {{ dataObj.parentNum }}</div>
        <div class="content_item">已注册其他人: {{ dataObj.otherRoleNum }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectAccess } from '@/api'
import vuexMixin from '@/mixin/useVuexMixin'
import { getListItem } from '@/util/ArrayUtil.js'

export default {
  name: 'CityPopup',
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
        // 接入学校数量
        accessShoolNum: 0,
        // 已注册其他人员数量
        otherRoleNum: 0,
        // 已注册家长
        parentNum: 0,
        // 已注册学生数量
        studentNum: 0,
        // 已注册老师数量,
        teacherNum: 0
      }
    }
  },
  computed: {
  },
  mounted () {
    // this.$nextTick(function () {
    //   this.$on('childMethod', function () {
    //     console.log('监听成功')
    //   })
    // })
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
      // let newData = this.vex_areaList.map((item) => {
      //   if (item.name === this.selectName) { return item }
      // }).filter(Boolean)
      // 拿到地图撒点名称，遍历item
      let newData = this.getListItem(this.vex_areaList, this.selectName)
      this.$store.commit('update_current_district', newData)
      this.$router.push({ path: '/area', query: { currentDistrict: this.selectName, currentNav: this.vux_currentNav.name, currentCycle: this.vux_currentCycle.name } })
    },
    // 市级、区级、校级接入情况统计
    async getSelectAccess (newValue) {
      try {
        const parameter = {
          // 周期切换
          dateCode: this.vux_currentCycle.value,
          // 市区切换
          orgCode: newValue,
          // 校区切换
          semesterCode: this.vux_currentNav.value
        }
        const { code, result } = await selectAccess(parameter)
        if (code === 0) {
          // console.log(result)
          this.dataObj = {
            // 接入学校数量
            accessShoolNum: result ? result.accessShoolNum || 0 : 0,
            // 已注册其他人员数量
            otherRoleNum: result ? result.otherRoleNum || 0 : 0,
            // 已注册家长
            parentNum: result ? result.parentNum || 0 : 0,
            // 已注册学生数量
            studentNum: result ? result.studentNum || 0 : 0,
            // 已注册老师数量,
            teacherNum: result ? result.teacherNum || 0 : 0
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
        let newData = this.getListItem(this.vex_areaList, val)

        // let newValue = this.vex_areaList.map((item) => {
        //   if (item.name === val) { return item.value }
        // }).filter(Boolean)
        console.log(newData)
        this.getSelectAccess(newData?.value)
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
  width: 394px;
  height: 250px;
  background-image: url("~@/assets/images/map_popup.png");
  background-size: 100% 100%;
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  line-height: 25px;

  .del_icon {
    position: absolute;
    // width: 23px;
    // height: 23px;
    // text-align: center;
    // line-height: 18px;
    // border: 1px solid #fff;
    // border-radius: 50%;
    // top: 7px;
    right: 10px;
    z-index: 9999;
    font-size: 30px;
    font-weight: 100;
    cursor: pointer;
    transform: rotateZ(45deg);
  }

  .layer_box {
    margin: 30px 20px 10px 90px;

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

      .header_right {
        cursor: pointer;

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
      padding-left: 18px;

      .content_item {
        padding: 5px 0;
      }
    }
  }
}
</style>
