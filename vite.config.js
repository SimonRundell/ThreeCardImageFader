import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/ThreeCardImageFader.jsx'),
      name: 'ThreeCardImageFader',
      fileName: (format) => `three-card-image-fader.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Externalize react deps in UMD build
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
