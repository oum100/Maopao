// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@sidebase/nuxt-auth','@prisma/nuxt', '@pinia/nuxt', 'vuetify-nuxt-module'],
  // modules: ['@prisma/nuxt', '@pinia/nuxt', 'vuetify-nuxt-module'],
  vuetify: {
    moduleOptions:{},
    vuetifyOptions:{
      icons:{
        defaultSet:'mdi',
        sets: ['mdi','fa']
      }
    }
  },

  auth:{
    originEnvKey: process.env.AUTH_ORIGIN,
    baseURL: "http://localhost:3000/api/auth",
    // baseURL: process.env.AUTH_ORIGIN||'http://localhost:3000',
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'github',
      addDefaultCallbackUrl: true
    },
    globalAppMiddleware:true,
  },

  runtimeConfig: {
    public: {
      authOrigin: process.env.AUTH_ORIGIN||'http://localhost:3000'
    },
    authSecret: process.env.AUTH_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }

})