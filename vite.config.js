import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  // 静态资源服务的文件夹, 默认"public"
  publicDir: 'public',
  server: {
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: '0.0.0.0',
    // 服务器端口号
    port: 3000,
    // boolean | string 启动项目时自动在浏览器打开应用程序；如果为string，比如"/index.html"，会打开http://localhost:3000/index.html
    open: true,
    // 自定义代理规则
    proxy: {
      '/prod-api': {
        // target: 'https://www.fastmock.site/mock/7212f6ee12fe1292f2a58a36f9199a03/mvpDashboard',// 生产
        target: 'http://139.196.235.132:90/', // 开发
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prod-api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    // 指定输出路径，默认'dist'
    outDir: 'dist',
    // 指定生成静态资源的存放路径(相对于build.outDir)
    // assetsDir: 'dp_static2',
    // 小于此阈值的导入或引用资源将内联为base64编码，设置为0可禁用此项。默认4096（4kb）
    assetsInlineLimit: '4096',
    // 启用/禁用CSS代码拆分，如果禁用，整个项目的所有CSS将被提取到一个CSS文件中,默认true
    cssCodeSplit: true,
    // 构建后是否生成source map文件，默认false
    sourcemap: false,
    // 为true时，会生成manifest.json文件，用于后端集成
    manifest: false
  }
})
