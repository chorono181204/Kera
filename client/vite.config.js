import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  // Cho phép thằng Vite sử dụng được process.env, mặc định thì không mà sẽ phải dùng import.meta.env
  // Github issue: https://github.com/vitejs/vite/issues/1973

  // Deployment: https://vitejs.dev/guide/static-deploy#vercel
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: [
      '@emotion/react', 
      '@emotion/styled', 
      '@mui/material/Tooltip'
    ],
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    svgr(),
  ]
})