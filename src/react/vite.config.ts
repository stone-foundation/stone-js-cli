import builtins from 'module'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import react from '@vitejs/plugin-react'

export const viteConfig = defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          presets: [
            ['@babel/preset-env', {
              targets: { node: '20' },
              bugfixes: true,
              modules: false,
              useBuiltIns: false
            }],
            '@babel/preset-typescript'
          ],
          plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]]
        }
      }),
      babel({
        filter: (file) => /\.(t|j)sx?$/.test(file) && !file.includes('node_modules'),
        babelConfig: {
          babelrc: false,
          configFile: false,
          presets: [
            ['@babel/preset-env', {
              targets: { node: '20' },
              bugfixes: true,
              modules: false,
              useBuiltIns: false
            }],
            '@babel/preset-typescript'
          ],
          plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]]
        }
      })
    ],

    build: {
      target: 'esnext',
      rollupOptions: {
        external: [...builtins.builtinModules, /node:/],
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      }
    },

    ssr: {
      noExternal: true,
      external: undefined
    },

    resolve: {
      extensions: ['.js', '.mjs', '.ts', '.jsx', '.mjsx', '.tsx', '.json']
    },

    esbuild: {
      jsxInject: 'import React from \'react\''
    }
  }
})
