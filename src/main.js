import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import zh from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/index.scss' // 全局css

createApp(App).use(router).use(ElementPlus, {
    locale: zh
}).mount('#app')
