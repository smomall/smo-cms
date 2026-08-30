// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@comark/nuxt',
    '@nuxt/image'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
    prose: true,
    experimental: {
      componentDetection: true
    }
  },
  runtimeConfig: {
    public: {
      apiBaseURL: '/api'
    }
  },

  routeRules: {
    '/**': { isr: 1800 }
  },

  devServer: {
    port: 5000
  },

  compatibilityDate: '2026-08-30',

  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },
  vite: {
    resolve: {
      alias: {
        elkjs: 'elkjs/lib/elk.bundled.js'
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  icon: {
    clientBundle: {
      scan: true
    }
  }
})
