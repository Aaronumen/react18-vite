import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import autoprefixer from 'autoprefixer'
import commpressPlugin from "vite-plugin-compression"
import { visualizer } from "rollup-plugin-visualizer"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    commpressPlugin({
    verbose: true, // 默认即可
    disable: false, //开启压缩(不禁用)，默认即可
    deleteOriginFile: false, //删除源文件
    threshold: 10240, //压缩前最小文件大小
    algorithm: "gzip", //压缩算法
    ext: ".gz" //文件类型
  }),
  visualizer({
    gzipSize: true,
    brotliSize: true,
    emitFile: false,
    filename: "buildSize.html", //分析图生成的文件名
    open: false //如果存在本地服务端口，将在打包后自动展示
  })],
  css:{
    preprocessorOptions:{
      less:{
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve('src/styles/global.less')}";`,
        },
      }
    },
    postcss:{
      plugins:[
        autoprefixer({
          overrideBrowserslist: [
            "Android 4.1",
            "iOS 7.1",
            "Chrome > 31",
            "ff > 31",
            "ie >= 8"
            //'last 10 versions', // 所有主流浏览器最近2个版本
        ],
        grid: true
      })
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  build: {
    assetsInlineLimit: 4096,
    // sourcemap:true,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules/.pnpm")) {
            return id
              .toString()
              .split("node_modules/.pnpm/")[1]
              .split("/")[0]
              .toString()
          }
        }
      }
    }
  }
})
