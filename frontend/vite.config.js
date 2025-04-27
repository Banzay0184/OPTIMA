import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [
                postcssImport(),
                autoprefixer()
            ],
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://optima.fly.dev/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
