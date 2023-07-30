import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  runtimeConfig: {
    accessKeyId: process.env.NUXT_AWS_ACCESS_KEY_ID, // plivate設定
    secretAccessKey: process.env.NUXT_AWS_SECRET_ACCESS_KEY, // plivate設定
    // public設定
    public: {
      // dynamodbEndpoint: 'http://dynamodb-local:8000',
      dynamodbEndpoint: 'http://localhost:8000',
      region: process.env.NUXT_REGION,
      version: process.env.NUXT_VERSION,
    },
  },
  nitro: {
    preset: 'aws-lambda', // サーバーサイドをどこで動かすか
  },
  devtools: { enabled: true },
  ssr: false,
  app: {
    // pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'test',
      meta: [{ name: 'description', content: "testtest" }],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },
  typescript: {
    strict: false,
    typeCheck: false
  },
  build: {
      transpile: ['vuetify'],
  },
  hooks: {
      'vite:extendConfig': (config) => {
          config.plugins!.push(vuetify())
      },
  },
  vite: {
      ssr: {
          noExternal: ['vuetify'],
      },
      define: {
          'process.env.DEBUG': false,
      },
  },
  css: ['@/assets/main.scss'],
})
