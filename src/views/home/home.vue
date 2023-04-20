<template>
    <div class="container">
        <!-- 头部logo -->
        <div class="logoWrap">
            <span>朱泾镇积水监测平台</span>
            <i>{{ dateTime }}</i>
        </div>
        <div id="map"></div>
        <!-- 中间顶部在线数量 -->
        <div class="topCountWrap">
            <div class="itemWrap">
                <div class="circle">
                    <i class="iconfont icon-shebei"></i>
                </div>
                <div>
                    <p>在线设备数</p>
                    <p><span class="count">{{ equipmentStatusCount.total_online_num }}</span>个</p>
                </div>
            </div>
            <div class="itemWrap">
                <div class="circle circle1">
                    <i class="iconfont icon-jinjigaojing"></i>
                </div>
                <div>
                    <p>今日告警数</p>
                    <p><span class="count count1">{{ equipmentStatusCount.today_alarm_num }}</span>个</p>
                </div>
            </div>
        </div>
        <!-- 左侧 -->
        <div class="homeLeft">
            <div class="areaTitle">
                <i class="iconfont icon-shexiangtou"></i>
                <span>视频监控</span>
            </div>
            <div class="shiPinWrap">
                <div class="shiPin" id="shiPin"></div>
                <p class="videoName">{{ currentShipin.Shipin.name }}</p>
                <ul class="carouselWrap">
                    <li :class="{ 'active': currentShipin.Shipin.name === item.Shipin.name }"
                        v-for="(item, index) in shiPinList" :key="index" @click="switchShiPin(item)"></li>
                </ul>
            </div>
            <div class="areaTitle">
                <i class="iconfont icon-shuichi"></i>
                <span>水尺状态</span>
            </div>
            <el-table class="eleTable" :data="shuiChiList" height="195px" style="width: 100%">
                <el-table-column show-overflow-tooltip align="center" label="积水点" prop="Group.name" />
                <el-table-column show-overflow-tooltip align="center" label="所属类型" prop="Shuichi">
                    <template #default="props">
                        {{ props.row.Shuichi.sub_type === '1' ? '低洼处' : '水泵处' }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="水位信息" prop="Shuichi">
                    <template #default="props">
                        {{ props.row.Shuichi.value }}{{ props.row.Shuichi.unit }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="在线状态" prop="Shuichi">
                    <template #default="props">
                        <p v-if="props.row.Shuichi.state === '1'"><span class="status status1"></span>在线</p>
                        <p v-if="props.row.Shuichi.state === '0'"><span class="status status2"></span>离线</p>
                    </template>
                </el-table-column>
            </el-table>
            <div class="areaTitle">
                <i class="iconfont icon-shebeikongzhi-shuibeng"></i>
                <span>水泵状态</span>
            </div>
            <el-table class="eleTable" :data="shuiBengList" height="195px" style="width: 100%">
                <el-table-column show-overflow-tooltip align="center" label="编号" prop="Shuibeng.name" />
                <el-table-column show-overflow-tooltip align="center" label="所属积水点" prop="Group.name" />
                <el-table-column show-overflow-tooltip align="center" label="设备状态" prop="Shuibeng">
                    <template #default="props">
                        <p v-if="props.row.Shuibeng.open_close === '1'"><span class="status status1"></span>开</p>
                        <p v-if="props.row.Shuibeng.open_close === '0'"><span class="status status2"></span>关</p>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="在线状态" prop="Shuibeng">
                    <template #default="props">
                        <p v-if="props.row.Shuibeng.state === '1'"><span class="status status1"></span>在线</p>
                        <p v-if="props.row.Shuibeng.state === '0'"><span class="status status2"></span>离线</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 右侧 -->
        <div class="homeRight">
            <div class="areaTitle">
                <i class="iconfont icon-zaixianshebei"></i>
                <span>设备今日在线情况</span>
            </div>
            <div class="equipmentStatusChart" id="equipmentStatusChart"></div>
            <div class="areaTitle">
                <i class="iconfont icon-liebiao"></i>
                <span>积水点列表</span>
            </div>
            <el-table class="eleTable" :data="PondingDistributionList" height="215px" :row-class-name="tableRowClassName"
                @row-click="PondingRowClick" style="width: 100%">
                <el-table-column show-overflow-tooltip align="center" width="150px" label="名称" prop="name" />
                <el-table-column show-overflow-tooltip align="center" label="积水点位置" prop="address" />
            </el-table>
            <div class="areaTitle">
                <i class="iconfont icon-gaojingshijian"></i>
                <span>告警事件</span>
            </div>
            <el-table class="eleTable eleTable1" :data="alarmlist" height="312px" style="width: 100%">
                <el-table-column show-overflow-tooltip align="center" width="180px" prop="name">
                    <template #default="props">
                        <div class="alertFirstColumn">
                            <div class="circle">
                                <i class="iconfont icon-shebeikongzhi-shuibeng color1" v-if="props.row.type === '1'"></i>
                                <i class="iconfont icon-shuichi" v-if="props.row.type === '2'"></i>
                            </div>
                            <div>
                                <p class="name name1" v-if="props.row.type === '1'">水泵告警 {{ props.row.name }}</p>
                                <p class="name" v-if="props.row.type === '2'">水尺告警</p>
                                <p class="deep">{{ props.row.desc }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="alarm_time" />
                <el-table-column show-overflow-tooltip align="center" prop="Group.name" />
            </el-table>
        </div>
        <!-- 积水点信息弹窗 -->
        <div class="pondingModal scroll" v-show="pondingModalVisi">
            <div class="innerWrap">
                <h3 class="modalTitle">{{ pondingObj.name }}</h3>
                <i class="closeBtn iconfont icon-guanbi" @click="closePondingModal"></i>
                <span class="aroundItem leftTop"></span>
                <span class="aroundItem leftBottom"></span>
                <span class="aroundItem RightTop"></span>
                <span class="aroundItem RightBottom"></span>
                <el-table class="eleTable" :data="pondingObj.equipmentList" :row-key="getRowKeys" :expand-row-keys="expands"
                    @expand-change="expandChange" style="width: 100%">
                    <el-table-column type="expand">
                        <template #default="props">
                            <div class="expandWrap" v-if="props.row.type === '水尺'">
                                <div class="line">
                                    <span class="label">当前水位深度</span>
                                    <span>{{ props.row.value }}{{ props.row.unit }}</span>
                                </div>
                                <div class="line">
                                    <span class="label">水尺在线状态</span>
                                    <span v-if="props.row.state === '1'"><span class="status status1"></span>在线</span>
                                    <span v-if="props.row.state === '0'"><span class="status status2"></span>离线</span>
                                </div>
                                <div class="line">
                                    <span class="label">最后一次告警时间</span>
                                    <span>{{ props.row.last_alarm_time }}</span>
                                </div>
                            </div>
                            <div class="expandWrap" v-if="props.row.type === '水泵'">
                                <div class="line">
                                    <span class="label">编号</span>
                                    <span>{{ props.row.name }}</span>
                                </div>
                                <div class="line">
                                    <span class="label">水泵在线状态</span>
                                    <span v-if="props.row.state === '1'"><span class="status status1"></span>在线</span>
                                    <span v-if="props.row.state === '0'"><span class="status status2"></span>离线</span>
                                </div>
                                <div class="line">
                                    <span class="label">水泵是否开启</span>
                                    <span v-if="props.row.open_close === '1'"><span class="status status1"></span>开启</span>
                                    <span v-if="props.row.open_close === '0'"><span class="status status2"></span>关闭</span>
                                </div>
                                <div class="line">
                                    <span class="label">水泵开启时间</span>
                                    <span>{{ props.row.last_open_time }}</span>
                                </div>
                                <div class="line">
                                    <span class="label">水泵关闭时间</span>
                                    <span>{{ props.row.last_close_time }}</span>
                                </div>
                            </div>
                            <div :id="'expandShiPinWrap' + props.row.id" class="expandShiPinWrap"
                                v-if="props.row.type === '视频'"></div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="设备名称" prop="name" />
                    <el-table-column align="center" label="在线状态">
                        <template #default="props">
                            <p v-if="props.row.state === '1'"><span class="status status1"></span>在线</p>
                            <p v-if="props.row.state === '0'"><span class="status status2"></span>离线</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="时间" prop="change_state_time" />
                </el-table>
                <div class="waterDeepWrap">
                    <div class="areaTitle">
                        <i class="iconfont icon-shuiwei"></i>
                        <span>水位信息</span>
                    </div>
                    <ul class="timeTab">
                        <li :class="{ active: waterDeepActive === 'shuichi_hourdata' }"
                            @click="waterDeepChartChange('shuichi_hourdata')">近一小时</li>
                        <li :class="{ active: waterDeepActive === 'shuichi_daydata' }"
                            @click="waterDeepChartChange('shuichi_daydata')">近七天</li>
                    </ul>
                </div>
                <div class="waterDeepChart" id="waterDeepChart"></div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
// import geoJson from '@/assets/zhujingtown.json'
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
export default {
    name: 'Login',
    data() {
        return {
            map: null,// 地图实例
            MAPMarkerArr: [],
            dateTime: '',// 年月日时分秒
            shuiBengList: [],// 水泵列表
            shuiChiList: [],// 水尺列表
            shiPinList: [],// 视频列表
            currentShipin: {
                Shipin: {
                    name: ''
                }
            },// 当前显示的视频
            shiPinPlayer: null,
            PondingDistributionList: [],// 积水点列表
            equipmentStatusCount: {},// 项目设备状态数量
            alarmlist: [], // 历史告警列表
            pondingModalVisi: false,// 是否显示积水弹窗
            expands: [],
            // 积水点详情
            pondingObj: {
                equipmentList: []
            },
            waterDeepActive: 'shuichi_hourdata'
        }
    },
    mounted() {
        setInterval(() => {
            this.getDateWeek()
        }, 1000)
        this.initBaiDuMap()

        this.getPondingDistribution()
        this.getEquipmentStatusCount()
        this.getAlarmlist()
        this.getEquipmentStatus(1)
        this.getEquipmentStatus(2)
        this.getEquipmentStatus(3)

        setInterval(() => {
            this.getPondingDistribution()
            this.getEquipmentStatusCount()
            this.getAlarmlist()
            this.getEquipmentStatus(1)
            this.getEquipmentStatus(2)
        }, 1000 * 60)
    },
    methods: {
        // 格式化当前系统时间
        getDateWeek() {
            const date = new Date()
            let year = date.getFullYear() // 获取完整的年份
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hours = date.getHours()
            let minus =
                date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
            let seconds =
                date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
            this.dateTime = `${year}年${month}月${day}日 ${hours}:${minus}:${seconds}`
        },
        // 获取水尺、水泵、视频状态列表数据
        getEquipmentStatus(type) {
            const params = {
                cmd: 'project_realtimedata',
                sid: getSessionStorage('token'),
                data: {
                    type: type,  // 1-水泵  2-水尺 3-视频 空-为全部
                }
            }
            apiPost('V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                if (type === 1) {
                    this.shuiBengList = res.data
                } else if (type === 2) {
                    this.shuiChiList = res.data
                } else {
                    this.shiPinList = res.data
                    this.currentShipin = res.data[0]
                    if (res.data.length > 0) {
                        const params1 = {
                            cmd: 'shipin_videourl',
                            sid: getSessionStorage('token'),
                            data: {
                                guid: res.data[0].Shipin.id
                            }
                        }
                        apiPost('V2/index_prod.php', {
                            data: {
                                json: JSON.stringify(params1)
                            }
                        }).then((resp) => {
                            this.shiPinPlayer = new HlsJsPlayer({
                                id: 'shiPin',
                                url: resp.data.url,
                                autoplay: true,
                                playsinline: true,
                                fluid: true, // 流体
                                useHls: true,
                                volume: 0,
                                width: 426,
                                height: 240,
                                lang: 'zh-cn'
                            })
                        })
                    }
                }
            })
        },
        // 轮播切换视频
        switchShiPin(item) {
            if (this.currentShipin.Shipin.name === item.Shipin.name) {
                return
            }
            let message = this.$message({
                message: '视频加载中，请稍后',
                duration: 0
            });
            const params1 = {
                cmd: 'shipin_videourl',
                sid: getSessionStorage('token'),
                data: {
                    guid: item.Shipin.id
                }
            }
            apiPost('V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params1)
                }
            }).then((resp) => {
                this.currentShipin = item
                if (this.shiPinPlayer) {
                    this.shiPinPlayer.destroy()
                }
                this.shiPinPlayer = new HlsJsPlayer({
                    id: 'shiPin',
                    url: resp.data.url,
                    autoplay: true,
                    playsinline: true,
                    fluid: true, // 流体
                    useHls: true,
                    volume: 0,
                    width: 426,
                    height: 240,
                    lang: 'zh-cn'
                })
            }).finally(() => {
                message.close()
            })
        },
        // 查询积水点位列表并初始化中间地图
        getPondingDistribution() {
            const params = {
                cmd: 'project_grouplist',
                sid: getSessionStorage('token'),
                data: {}
            }
            apiPost('V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                let data = res.data
                this.PondingDistributionList = res.data
                this.createMarker(data)
            })
        },
        // 初始化中间地图
        initBaiDuMap() {
            this.map = new BMapGL.Map('map') // 创建地图实例 
            this.map.setMapStyleV2({ styleId: 'c7c449c116b45574198544bc8a7e85fd' })
            let point = new BMapGL.Point(121.1612282615, 30.8978092721) // 创建点坐标 
            this.map.centerAndZoom(point, 19) // 初始化地图，设置中心点坐标和地图级别
            this.map.enableScrollWheelZoom()
            this.map.setTilt(60)

            //  朱泾镇边界经纬度
            let aaa = '121.143623,30.850528;121.143589,30.850527;121.13403,30.850188;121.123643,30.84963;121.122704,30.849615;121.12091,30.849789;121.120863,30.850788;121.120632,30.851537;121.120145,30.851429;121.119705,30.852802;121.119969,30.852863;121.119826,30.853402;121.119953,30.853441;121.119846,30.853808;121.119993,30.853949;121.119901,30.854467;121.119783,30.854721;121.120043,30.854799;121.120024,30.854907;121.119762,30.85492;121.119503,30.855728;121.119101,30.855877;121.11911,30.856024;121.118951,30.856406;121.118779,30.856409;121.118698,30.856225;121.118493,30.856172;121.118402,30.856421;121.118801,30.856539;121.118476,30.857252;121.117839,30.857097;121.117769,30.857148;121.117907,30.857288;121.11805,30.857305;121.117675,30.858213;121.118532,30.858372;121.11875,30.858236;121.118706,30.85895;121.118582,30.858973;121.118614,30.859087;121.119537,30.858809;121.12042,30.85868;121.121033,30.858443;121.121052,30.858639;121.120766,30.85871;121.12095,30.859218;121.120626,30.859309;121.120618,30.859781;121.120709,30.860151;121.120804,30.860144;121.120657,30.861364;121.120711,30.861362;121.120708,30.86164;121.118294,30.861108;121.117067,30.861024;121.116139,30.861073;121.116293,30.861383;121.116162,30.861419;121.116214,30.861588;121.11638,30.861549;121.116476,30.861826;121.116336,30.862137;121.11666,30.863162;121.116546,30.863168;121.116453,30.862889;121.116235,30.861696;121.115831,30.861745;121.115755,30.861543;121.115247,30.861724;121.115091,30.862735;121.114911,30.862789;121.11486,30.863078;121.114581,30.863121;121.114567,30.863603;121.114941,30.865191;121.115233,30.865152;121.115405,30.865955;121.11605,30.865881;121.116079,30.866059;121.115989,30.866074;121.116043,30.866152;121.117131,30.865968;121.117406,30.866756;121.117586,30.867833;121.117567,30.868088;121.117851,30.868922;121.118328,30.871076;121.118323,30.871401;121.118115,30.872125;121.117875,30.872423;121.117711,30.872785;121.116327,30.872678;121.116299,30.872903;121.116021,30.872907;121.115563,30.87286;121.115576,30.872723;121.115207,30.872684;121.115418,30.872126;121.115509,30.871551;121.114188,30.871559;121.114075,30.871471;121.11376,30.871445;121.113562,30.872344;121.112447,30.872247;121.111384,30.87239;121.11084,30.872521;121.109697,30.872576;121.110016,30.871062;121.109881,30.871058;121.109699,30.871419;121.108397,30.871106;121.108101,30.871502;121.10725,30.871822;121.107178,30.871857;121.107377,30.872474;121.107323,30.872637;121.107015,30.872657;121.104605,30.872396;121.104506,30.873455;121.103377,30.873512;121.103723,30.877127;121.10422,30.877216;121.104043,30.879698;121.104042,30.879718;121.10349,30.886801;121.102892,30.886685;121.10269,30.887508;121.102555,30.887508;121.102433,30.890255;121.102325,30.890304;121.101992,30.891041;121.101733,30.891902;121.101725,30.892307;121.103123,30.892397;121.102998,30.893859;121.103786,30.894496;121.104928,30.89569;121.105824,30.896296;121.106073,30.896626;121.106198,30.897155;121.107502,30.898215;121.108841,30.899631;121.109892,30.900697;121.111604,30.902188;121.112414,30.903039;121.113468,30.903789;121.116629,30.903574;121.117728,30.903374;121.119003,30.905356;121.120868,30.905072;121.121162,30.905059;121.121355,30.905212;121.12166,30.905279;121.125402,30.904881;121.125347,30.904281;121.126242,30.904165;121.126333,30.904061;121.126371,30.903969;121.126242,30.90312;121.126704,30.902266;121.126888,30.902269;121.126927,30.902006;121.127139,30.901971;121.127185,30.902066;121.127449,30.902115;121.12759,30.902651;121.128863,30.902515;121.128974,30.902436;121.129024,30.902258;121.129141,30.902266;121.129257,30.902682;121.129585,30.903186;121.129668,30.903671;121.129814,30.90386;121.129838,30.904178;121.13663,30.903293;121.136556,30.903593;121.136725,30.904988;121.136429,30.906872;121.136083,30.907949;121.13534,30.908534;121.135151,30.9088;121.134938,30.909378;121.135248,30.910632;121.135534,30.912459;121.135418,30.912633;121.13523,30.91275;121.134517,30.912801;121.134443,30.913385;121.134315,30.913383;121.134324,30.913486;121.134127,30.913496;121.134122,30.913568;121.133105,30.91361;121.133064,30.914101;121.132726,30.915167;121.132996,30.91662;121.134481,30.921858;121.137161,30.92148;121.137046,30.921106;121.138574,30.920276;121.137589,30.919161;121.137406,30.918868;121.13748,30.918487;121.1376,30.91846;121.137507,30.918232;121.137581,30.918147;121.137481,30.917743;121.138783,30.917727;121.138643,30.9173;121.138456,30.917375;121.13838,30.91722;121.138224,30.917253;121.138145,30.917068;121.145144,30.914824;121.145232,30.913465;121.146265,30.913457;121.146266,30.913724;121.146957,30.913588;121.146774,30.913014;121.148039,30.91289;121.148017,30.912537;121.148559,30.912493;121.148886,30.913502;121.151653,30.912621;121.151986,30.920533;121.152123,30.920986;121.152449,30.921581;121.152843,30.922025;121.153131,30.922235;121.1536,30.922346;121.158204,30.922526;121.158771,30.922445;121.159628,30.922123;121.160619,30.921705;121.161075,30.92131;121.16137,30.920868;121.161937,30.919708;121.162502,30.919008;121.164219,30.917873;121.165916,30.917001;121.166603,30.916727;121.168282,30.916735;121.168851,30.916818;121.169598,30.917047;121.170382,30.91715;121.173768,30.917033;121.178017,30.917211;121.18086,30.917547;121.181572,30.917662;121.182013,30.917828;121.182985,30.918538;121.18443,30.919128;121.188742,30.919337;121.191905,30.919704;121.193406,30.919878;121.197084,30.920968;121.199321,30.921478;121.202212,30.921902;121.203813,30.922279;121.206023,30.923151;121.206595,30.92345;121.208238,30.924805;121.209636,30.92621;121.21239,30.92862;121.214558,30.930457;121.216315,30.931746;121.216901,30.932089;121.218092,30.932645;121.218896,30.932856;121.21906,30.932837;121.219216,30.932699;121.220763,30.9307;121.222611,30.929058;121.222712,30.929085;121.223827,30.927889;121.224591,30.926418;121.224754,30.925943;121.224541,30.92495;121.223807,30.923239;121.223646,30.921928;121.223976,30.920991;121.22478,30.92;121.225869,30.919218;121.229546,30.917598;121.230482,30.916933;121.23259,30.915163;121.232521,30.913507;121.231265,30.911844;121.229471,30.909756;121.230233,30.906252;121.229663,30.906021;121.228269,30.905261;121.228036,30.904743;121.228582,30.903698;121.231543,30.901457;121.231203,30.901077;121.23088,30.900142;121.230294,30.897907;121.230291,30.897889;121.229061,30.893148;121.227318,30.886957;121.227311,30.886934;121.226935,30.885444;121.226684,30.885101;121.22668,30.884624;121.226512,30.883945;121.225808,30.884101;121.225027,30.883176;121.224837,30.882489;121.224819,30.881665;121.225237,30.880657;121.22555,30.880144;121.226957,30.878552;121.226924,30.878318;121.226561,30.878247;121.226773,30.877872;121.226566,30.877786;121.226742,30.877297;121.226677,30.877273;121.22718,30.876395;121.227549,30.876545;121.227743,30.876155;121.228224,30.875488;121.228373,30.875311;121.228461,30.875341;121.228494,30.875275;121.228154,30.875049;121.229434,30.873835;121.229573,30.873522;121.229839,30.873514;121.229998,30.873614;121.230307,30.87356;121.230604,30.872859;121.230353,30.872695;121.23033,30.872453;121.230464,30.872454;121.230522,30.871881;121.230358,30.871759;121.230489,30.871378;121.23108,30.870601;121.231725,30.870277;121.231952,30.86971;121.231577,30.869719;121.231198,30.869767;121.230823,30.869651;121.230261,30.869767;121.229991,30.869741;121.230025,30.86888;121.229619,30.868814;121.229616,30.867921;121.228309,30.867847;121.228237,30.867669;121.228298,30.867434;121.227723,30.867368;121.227934,30.866756;121.22759,30.866616;121.227304,30.867359;121.226048,30.867233;121.225932,30.867538;121.224657,30.867134;121.224309,30.867805;121.222708,30.867227;121.222345,30.86692;121.221866,30.866832;121.222046,30.866284;121.219622,30.865592;121.219234,30.866336;121.218669,30.866234;121.218841,30.864004;121.218975,30.864019;121.219005,30.86348;121.218427,30.863464;121.218411,30.863237;121.218998,30.861907;121.218591,30.861956;121.217652,30.861861;121.217419,30.86177;121.217484,30.861344;121.218077,30.861374;121.218122,30.86123;121.218338,30.861233;121.218814,30.861088;121.218032,30.860003;121.216669,30.859889;121.216496,30.860384;121.215695,30.860267;121.215547,30.860657;121.214533,30.860444;121.214206,30.861085;121.213689,30.860888;121.213651,30.860885;121.211944,30.860684;121.21057,30.8603;121.210531,30.86058;121.209464,30.860427;121.209743,30.859824;121.210044,30.859689;121.21031,30.859262;121.210425,30.858592;121.208758,30.858634;121.208611,30.857709;121.209517,30.857747;121.209558,30.857633;121.210727,30.857763;121.210814,30.857633;121.210483,30.857514;121.208884,30.857548;121.20888,30.857482;121.208367,30.857426;121.208368,30.857353;121.207958,30.857344;121.20808,30.856114;121.209052,30.856279;121.209245,30.855124;121.209386,30.855138;121.209549,30.854397;121.209049,30.854324;121.20907,30.8541;121.206455,30.853569;121.206102,30.853701;121.205515,30.854116;121.204811,30.85411;121.201905,30.854836;121.201137,30.855009;121.201125,30.855175;121.201059,30.855212;121.200575,30.85512;121.200168,30.855325;121.199843,30.855636;121.199182,30.855718;121.197303,30.856575;121.197302,30.856641;121.197083,30.856678;121.197069,30.856775;121.196727,30.85676;121.196536,30.858246;121.195935,30.858276;121.195918,30.858501;121.19568,30.858497;121.195589,30.859131;121.195035,30.859179;121.194994,30.859725;121.19447,30.859571;121.194488,30.859124;121.194748,30.858069;121.193181,30.858025;121.192915,30.857924;121.192693,30.857605;121.192385,30.857633;121.192093,30.857877;121.191866,30.855207;121.191243,30.855131;121.191274,30.854983;121.19065,30.85491;121.19022,30.854894;121.190102,30.855758;121.18953,30.855866;121.1886,30.85579;121.188661,30.854967;121.188226,30.854988;121.188166,30.856579;121.186369,30.85591;121.18556,30.856318;121.185021,30.856426;121.184473,30.856702;121.182855,30.856923;121.181345,30.857459;121.180148,30.857665;121.179453,30.857915;121.178809,30.858051;121.178396,30.858266;121.177426,30.858534;121.176654,30.858347;121.176416,30.85898;121.176115,30.860483;121.1759,30.862531;121.176,30.865026;121.175983,30.866644;121.175712,30.868562;121.175358,30.871319;121.17452,30.876144;121.173894,30.875965;121.170766,30.875825;121.167993,30.874996;121.166738,30.874869;121.164054,30.874763;121.163114,30.874533;121.162915,30.874318;121.16238,30.872963;121.162311,30.872416;121.162219,30.868907;121.162581,30.862948;121.16255,30.860753;121.162449,30.859784;121.162484,30.859164;121.162108,30.856813;121.161906,30.856025;121.16119,30.854563;121.159284,30.8523;121.158171,30.851401;121.156827,30.850485;121.15094,30.850712;121.143623,30.850528'
            var hole = new BMapGL.Polygon(aaa, {
                fillColor: '#2ab8ff',
                fillOpacity: 0.2
            });
            this.map.addOverlay(hole)
        },
        // 地图积水点撒点
        createMarker(data) {
            for (let i = 0; i < this.MAPMarkerArr.length; i++) {
                const element = this.MAPMarkerArr[i]
                this.map.removeOverlay(element)
            }
            this.MAPMarkerArr = []
            // 创建图标
            const normalIcon = new BMapGL.Icon(new URL('../../assets/img11.png', import.meta.url).href, new BMapGL.Size(107, 66))
            const abnormalIcon = new BMapGL.Icon(new URL('../../assets/img12.png', import.meta.url).href, new BMapGL.Size(107, 66))

            for (let i = 0; i < data.length; i++) {
                const element = data[i];

                const MAPPoniter = new BMapGL.Point(element.lon, element.lat)
                // 创建图像标注实例 默认样式是个红点 可进行设置
                const MAPMarker = new BMapGL.Marker(MAPPoniter, { icon: element.state === '1' ? normalIcon : abnormalIcon })

                // 设置标签 内容 偏移量
                const label = new BMapGL.Label(element.name, {
                    offset: new BMapGL.Size(-100, -31)
                })
                // 标签样式
                label.setStyle({
                    display: 'block',
                    border: 'none',
                    background: 'transparent',
                    width: '200px',
                    height: '30px',
                    lineHeight: '30px',
                    fontSize: 16,
                    color: 'white',
                    textAlign: 'center'
                })
                // 设置标签
                MAPMarker.setLabel(label)
                this.MAPMarkerArr.push(MAPMarker)

                // 点击事件监听
                let that = this
                MAPMarker.addEventListener('click', function (e) {
                    console.log(element);
                    that.getPondingInfo(element.group_id)
                })

                // 在地图中添加覆盖物
                this.map.addOverlay(MAPMarker)
            }
        },
        // 积水点列表行的 className 的回调方法
        tableRowClassName({ row, rowIndex }) {
            if (row.state === '0') {
                return 'cursor warningRow';
            }
            return 'cursor';
        },
        // 获取项目设备状态数量
        getEquipmentStatusCount() {
            const params = {
                cmd: 'project_stat',
                sid: getSessionStorage('token'),
                data: {}
            }
            apiPost('V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                this.equipmentStatusCount = res.data
                this.equipmentStatusChartInit(res.data)
            })
        },
        // 设备今日在线情况图表初始化
        equipmentStatusChartInit(data) {
            let myChart = echarts.init(document.getElementById('equipmentStatusChart'))
            const option = {
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: '水尺',
                        type: "pie",
                        clockWise: false,
                        radius: [55, 65],
                        itemStyle: {
                            shadowBlur: 0,
                            shadowColor: "#203665",
                        },
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false,
                        },
                        hoverAnimation: false,
                        center: ["15%", "50%"],
                        data: [
                            {
                                name: '在线',
                                value: data.Shuichi.online_num,
                                label: {
                                    rich: {
                                        a: {
                                            color: "#fff",
                                            align: "center",
                                            fontSize: 36,
                                            fontWeight: "bold",
                                        },
                                        b: {
                                            color: "#fff",
                                            align: "center",
                                            fontSize: 16,
                                        },
                                    },
                                    formatter: function (params) {
                                        return (
                                            "{a|" +
                                            params.value + "\n" + "}" +
                                            "{b|水尺}"
                                        );
                                    },
                                    position: "center",
                                    show: true,
                                },
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                        {
                                            offset: 0,
                                            color: "rgba(98, 219, 255, 1)",
                                        },
                                        {
                                            offset: 1,
                                            color: "rgba(61, 141, 255, 1)",
                                        },
                                    ]),
                                    shadowBlur: 0,
                                },
                            },
                            {
                                value: data.Shuichi.offline_num,
                                name: "离线",
                                itemStyle: {
                                    color: "rgba(255, 255, 255, 0.20)",
                                }, emphasis: {
                                    color: "rgba(255, 255, 255, 0.20)",
                                },
                            },
                        ],
                    },
                    {
                        name: "水泵",
                        type: "pie",
                        clockWise: false,
                        radius: [55, 65],
                        itemStyle: {
                            shadowBlur: 0,
                            shadowColor: "#203665",
                        },
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false,
                        },
                        hoverAnimation: false,
                        center: ["50%", "50%"],
                        data: [
                            {
                                name: '在线',
                                value: data.Shuibeng.online_num,
                                label: {
                                    rich: {
                                        a: {
                                            color: "#fff",
                                            align: "center",
                                            fontSize: 36,
                                            fontWeight: "bold",
                                        },
                                        b: {
                                            color: "#fff",
                                            align: "center",
                                            fontSize: 16,
                                        },
                                    },
                                    formatter: function (params) {
                                        return (
                                            "{a|" +
                                            params.value + "\n" + "}" +
                                            "{b|水泵}"
                                        );
                                    },
                                    position: "center",
                                    show: true,
                                },
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                        {
                                            offset: 0,
                                            color: "rgba(98, 255, 200, 1)",
                                        },
                                        {
                                            offset: 1,
                                            color: "rgba(50, 209, 231, 1)",
                                        },
                                    ]),
                                    shadowBlur: 0,
                                },
                            },
                            {
                                value: data.Shuibeng.offline_num,
                                name: "离线",
                                itemStyle: {
                                    color: "rgba(255, 255, 255, 0.20)",
                                },
                                emphasis: {
                                    color: "rgba(255, 255, 255, 0.20)",
                                },
                            },
                        ],
                    },
                    {
                        name: "视频",
                        type: "pie",
                        clockWise: false,
                        radius: [55, 65],
                        itemStyle: {
                            shadowBlur: 0,
                            shadowColor: "#203665",
                        },
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false,
                        },
                        hoverAnimation: false,
                        center: ["85%", "50%"],
                        data: [
                            {
                                name: '在线',
                                value: data.Shipin.online_num,
                                label: {

                                    rich: {
                                        a: {
                                            color: "#fff",
                                            align: "center",
                                            fontSize: 36,
                                            fontWeight: "bold",
                                        },
                                        b: {
                                            color: "#fff",
                                            align: "center",
                                            fontSize: 16,
                                        },
                                    },
                                    formatter: function (params) {
                                        return (
                                            "{a|" +
                                            params.value + "\n" + "}" +
                                            "{b|摄像头}"
                                        );
                                    },
                                    position: "center",
                                    show: true,
                                },
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                        {
                                            offset: 0,
                                            color: "rgba(150, 238, 121, 1)",
                                        },
                                        {
                                            offset: 1,
                                            color: "rgba(247, 253, 134, 1)",
                                        },
                                    ]),
                                    shadowBlur: 0,
                                },
                            },
                            {
                                value: data.Shipin.offline_num,
                                name: "离线",
                                itemStyle: {
                                    color: "rgba(255, 255, 255, 0.20)",
                                },
                                emphasis: {
                                    color: "rgba(255, 255, 255, 0.20)",
                                },
                            },
                        ],
                    },
                ],
            }
            myChart.setOption(option, true)
        },
        // 获取历史告警列表
        getAlarmlist() {
            const params = {
                cmd: 'project_alarmlist',
                sid: getSessionStorage('token'),
                data: {
                    // type: '',  // 1-水泵  2-水尺 3-视频 空-为全部 
                    // num: 3000 // 返回的记录数 
                }
            }
            apiPost('V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                this.alarmlist = res.data
            })
        },
        // 积水点列表当某一行被点击时会触发该事件
        PondingRowClick(row) {
            let point = new BMapGL.Point(row.lon, row.lat) // 创建点坐标 
            this.map.centerAndZoom(point, 22) // 初始化地图，设置中心点坐标和地图级别
            this.getPondingInfo(row.group_id)
        },
        // 获取积水点详情数据
        getPondingInfo(id) {
            const params = {
                cmd: 'project_groupinfo',
                sid: getSessionStorage('token'),
                data: {
                    group_id: id
                }
            }
            apiPost('V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                this.pondingModalVisi = true
                this.waterDeepActive = 'shuichi_hourdata'
                let data = res.data
                data.equipmentList = []
                this.pondingObj = data
                if (data.Shuibengs) {
                    for (let i = 0; i < data.Shuibengs.length; i++) {
                        const element = data.Shuibengs[i]
                        element.type = '水泵'
                    }
                    this.pondingObj.equipmentList = [...data.Shuibengs]
                }
                if (data.Shuichi) {
                    data.Shuichi.type = '水尺'
                    this.pondingObj.equipmentList.push(data.Shuichi)
                    this.getPondingWater('shuichi_hourdata', data.Shuichi.id)
                }
                if (data.Shipin) {
                    data.Shipin.type = '视频'
                    this.pondingObj.equipmentList.push(data.Shipin)
                    // this.expands.push(data.Shipin.id)
                }
            })
        },
        expandChange(row, expanded) {
            console.log(row)
            console.log(expanded)
            if (expanded.length > 0 && row.type === '视频') {
                let message = this.$message({
                    message: '视频加载中，请稍后',
                    duration: 0
                });
                this.$nextTick(() => {
                    const params = {
                        cmd: 'shipin_videourl',
                        sid: getSessionStorage('token'),
                        data: {
                            guid: row.id
                        }
                    }
                    apiPost('V2/index_prod.php', {
                        data: {
                            json: JSON.stringify(params)
                        }
                    }).then((res) => {
                        new HlsJsPlayer({
                            id: 'expandShiPinWrap' + row.id,
                            url: res.data.url,
                            autoplay: true,
                            playsinline: true,
                            fluid: true, // 流体
                            useHls: true,
                            volume: 0,
                            width: 426,
                            height: 240,
                            lang: 'zh-cn'
                        })
                    }).finally(() => {
                        message.close()
                    })
                })
            }
        },
        // 关闭积水详情弹窗
        closePondingModal() {
            this.pondingModalVisi = false
        },
        // 获取积水点水位信息
        getPondingWater(time, shuichi_id) {
            const params = {
                cmd: time,
                sid: getSessionStorage('token'),
                data: {
                    shuichi_id: shuichi_id
                }
            }
            apiPost('V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                let data = res.data
                this.waterDeepChartInit(data)
            })
        },
        // 水位信息图表初始化
        waterDeepChartInit(data) {
            let xAxis = []
            let yAxis = []
            for (let i = 0; i < data.length; i++) {
                const element = data[i]
                xAxis.push(element.record_time.substring(5, element.record_time.length - 3))
                yAxis.push(element.data_value)
            }
            let myChart = echarts.init(document.getElementById('waterDeepChart'))
            const option = {
                tooltip: {
                    trigger: 'axis',
                },
                grid: {
                    top: '3%',
                    left: '3%',
                    right: '5%',
                    bottom: '20%',
                    containLabel: true
                },
                dataZoom: [
                    {
                        show: true,
                        type: 'slider',
                        realtime: true,
                        height: 15,
                        bottom: 8,
                        start: 0,
                        end: 20,
                        xAxisIndex: [0, 1],
                        handleSize: 4,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLabel: {
                            // interval: 0,
                            padding: [5, 0, 5, 0],
                            fontSize: 12,
                            color: '#fff',
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.15)',
                            },
                        },
                        boundaryGap: false,
                        data: xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {
                            // y轴刻度
                            show: false,
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                type: 'solid',
                                color: '#fff', // 左边线的颜色
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.15)',
                            },
                        },
                    }
                ],
                series: [
                    {
                        name: '水位',
                        type: 'line',
                        symbol: 'circle',
                        smooth: 0.6,
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: "rgba(54, 161, 255, 0.6)",
                                },
                                {
                                    offset: 1,
                                    color: "rgba(25, 104, 255, 0)",
                                },
                            ]),
                        },
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: "rgba(61, 230, 255, 1)",
                                },
                                {
                                    offset: 1,
                                    color: "rgba(25, 104, 255, 1)",
                                },
                            ]),
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: yAxis
                    },
                ]
            }
            myChart.setOption(option, true)
        },
        // 近一小时、近七天水位信息图表切换
        waterDeepChartChange(val) {
            this.waterDeepActive = val
            this.getPondingWater(val, this.pondingObj.Shuichi.id)
        },
        // 初始化hls视频播放
        hlsPlayerInit(data) {
            let player = new HlsJsPlayer({
                id: data.id,
                url: data.url,
                autoplay: true,
                playsinline: true,
                fluid: true, // 流体
                useHls: true,
                volume: 0,
                width: 426,
                height: 240,
                lang: 'zh-cn'
            });
        },
        // 根据一个条件从数组筛选出符合条件的项数组
        arrFilterItemFn(array, name, val) {
            let arr = array.filter((item) => {
                return item[name] === val
            })
            return arr
        },
        // 获取row的key值（这个方法不用修改，直接放上去就行）
        getRowKeys(row) {
            return row.id; // id为table每一栏的id
        },
    }
}
</script>
<style lang='scss' scoped>
@import './home.scss';
</style>
