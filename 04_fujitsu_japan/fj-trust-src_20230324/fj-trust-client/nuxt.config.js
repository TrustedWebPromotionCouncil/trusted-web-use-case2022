import colors from 'vuetify/es5/util/colors'

export default {
  server: {
    // host: '0.0.0.0',
    port: 3000
  },
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - fj-trust-client',
    title: 'fj-trust-client',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/auth-next',
  ],
  router: {
    //middleware: ['authenticated']
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: 'http://10.200.4.11:8889',
    // baseURL: '/',
    proxy: true,
    timeout: 60000,
    credentials: true,
  },
  proxy: {
    // '/api/': { target: 'http://localhost:5000', pathRewrite: {'^/api/': ''}},
    '/api': 'http://localhost:5000'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  auth: {
    redirect: {
      login: '/login',
//      logout: '/logout',
      callback: '/auth',
      home: '/',
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/api/auth/login",
            method: "post",
            propertyName: "token",
          },
          logout: false,
        }
      },
      aad: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
          token: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
          userInfo: '',
          logout: '/'
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: 'code',
        grantType: 'authorization_code',
        accessType: 'offline',
        // ******** change this for your Application (Client) ID ********
        clientId: '（Azure ADのクライアントIDを記入してください）',
        codeChallengeMethod: 'S256',
        scope: ['openid', 'profile'],
        autoLogout: true
      },
    }
  },
  router: {
    middleware: ['auth'],
  },
}
