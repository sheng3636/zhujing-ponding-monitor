import {
    createRouter,
    createWebHashHistory
} from "vue-router"
import {
    getSessionStorage
} from '@/utils/index'

const routes = [
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录'
        },
        component: () => import("@/views/login/login.vue")
    }, {
        path: '/',
        name: 'home',
        redirect: '/home'
    }, {
        path: '/home',
        name: 'Home',
        meta: {
            title: '首页'
        },
        component: () => import("@/views/home/home.vue")
    }]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

/**
 * 路由拦截器
 * 1.判断该路由是否需要登录权限
 * 2.通过vuex state获取当前的token是否存在
 * 3.将跳转的路由path作为参数，登录成功后跳转到该路由
 */
const whiteList = ['/login'] // 没有重定向白名单
router.beforeEach((to, from, next) => {
    const hasToken = getSessionStorage('token')
    // 当浏览器删掉路由时候，回退上一个路由路径
    if (hasToken) {
        if (to.path === '/login') {
            next({
                path: '/'
            })
        } else {
            next()
        }
    } else {
        // 没有令牌
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免费登录白名单，直接去
            next()
        } else {
            // 没有访问权限的其他页面被重定向到登录页面。
            next(`/login`)
        }
    }
})
export default router;

