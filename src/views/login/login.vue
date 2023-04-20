<template>
    <div class="container">
        <div class="logoWrap">
            <span>朱泾镇积水监测平台</span>
        </div>
        <el-form class="formWrap" ref="loginRuleForm" :model="loginForm" :rules="rules" label-width="0" status-icon>
            <p class="title">用户登陆</p>
            <el-form-item class="inputLine name" prop="name">
                <i class="iconfont icon-yonghu"></i>
                <el-input class="input1" v-model="loginForm.name" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item class="inputLine password" prop="password">
                <i class="iconfont icon-mima"></i>
                <el-input style="display: none;" type="password" placeholder="请输入密码1" />
                <el-input ref="password" class="input1" type="password" v-model="loginForm.password"
                    autocomplete="new-password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="rememberPass" label="记住密码" size="default" />
            </el-form-item>
            <el-form-item>
                <el-button class="submitBtn" type="primary" @click="submitForm(loginRuleForm)">登 陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getStore, setStore,setSessionStorage } from '@/utils/index'
export default {
    name: 'Login',
    data() {
        return {
            // 登录表单
            loginForm: {
                name: getStore('name') || '',
                password: getStore('password') || ''
            },
            rememberPass: getStore('rememberPass') === 'true' ? true : false, // 是否记住密码
            // 登陆表单验证规则
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
    },
    methods: {
        // 登录
        submitForm() {
            this.$refs['loginRuleForm'].validate((valid) => {
                if (valid) {
                    const params = {
                        cmd: "user_login",
                        sid: "",
                        data: {
                            'login_name': this.loginForm.name,
                            'login_password': this.loginForm.password
                        }
                    }
                    console.log(JSON.stringify(params));
                    apiPost('V2/index_prod.php', {
                        data: {
                            json: JSON.stringify(params)
                        }
                    }).then((res) => {
                        if (this.rememberPass && this.rememberPass !== 'false') {
                            setStore('rememberPass', true)
                            setStore('name', this.loginForm.name)
                            setStore('password', this.loginForm.password)
                        } else {
                            setStore('rememberPass', false)
                        }
                        setSessionStorage('token', res.data.sid)
                        this.$router.push({ path: '/' })
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>
<style lang='scss' scoped>
@import './login.scss';
</style>

