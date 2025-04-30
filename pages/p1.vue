<!-- layouts/default.vue -->
<template>
    <v-app class="bg">
      <v-main class="pa-0 ma-0">
        <div class="fill-screen">
          <slot />
        </div>
      </v-main>
    </v-app>
  </template>
  
<script setup lang="ts">
    definePageMeta({
      auth:false,
      layout: 'auth'
    })
</script>

  <style scoped>
  .fill-screen {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #e2a6fd; /* หรือใช้ background ตามต้องการ */
  }
  </style>
  
  <style>
  html, body, #__nuxt, #app {
    margin: 0 !important;
    padding: 0 !important;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  
  .v-application {
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .v-main {
    padding: 0 !important;
    margin: 0 !important;
  }
  </style>
  