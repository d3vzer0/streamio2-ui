/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */

module.exports = function (/* ctx */) {
  return {
    supportTS: false,
    boot: [
      'axios',
      'filters',
      'apex'
    ],
    css: [
      'app.scss'
    ],
    extras: [
      // 'ionicons-v4',
      'mdi-v5',
      // 'themify',
      'roboto-font', 
      'material-icons' 
    ],

    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'

      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      }
    },

    devServer: {
      https: false,
      port: 8080,
      host: '127.0.0.1',
      watchOptions: {
        poll: 1000
      },
      open: true
    },

    framework: {
      iconSet: 'material-icons',
      lang: 'en-us',
      config: {
      },

      importStrategy: 'auto',
      plugins: []
    },
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {},
      manifest: {
        name: 'vulnstreetbets',
        short_name: 'vulnstreetbets',
        description: 'Search engine and trend analysis for vulnerabilities',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },
    cordova: {
    },
    capacitor: {
      hideSplashscreen: true
    },
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
      },

      builder: {
        appId: 'streaming-ui'
      },

      nodeIntegration: true,
      extendWebpack (/* cfg */) {
      }
    }
  }
}
