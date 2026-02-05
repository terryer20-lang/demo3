
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      // 核心修復：確保這裡沒有 'external' 配置
      // 對於 SPA 應用，我們希望將所有依賴打包。
      output: {
        // 使用 manualChunks 進行代碼分割，優化 Vercel 加載性能
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-utils': ['html2canvas']
        }
      }
    },
    // 增加塊大小警告限制，避免構建時出現不必要的噪音
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
  }
})
