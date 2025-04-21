// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  // modules: ['@sidebase/nuxt-auth','@prisma/nuxt','@pinia/nuxt']
  modules: ['@prisma/nuxt', '@pinia/nuxt', 'vuetify-nuxt-module'],
  vuetify: {
    moduleOptions:{},
    vuetifyOptions:{
      icons:{
        defaultSet:'mdi',
        sets: ['mdi','fa']
      }
    }
  }
})