<template>
    <v-toolbar class="text-white" density="compact" image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
      <v-btn icon="mdi-menu"></v-btn>
      <v-toolbar-title>MaoPao</v-toolbar-title>
      <!-- <v-spacer></v-spacer> -->
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to="/device" prepend-icon="mdi-cog">Device</v-btn>
        <v-btn to="/language" prepend-icon="mdi-music-note">Language</v-btn>
        <v-btn to="/unit" prepend-icon="mdi-book">Unit</v-btn>
        <v-btn to="/testmode" prepend-icon="mdi-image">TestMode</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn prepend-icon="mdi-login" variant="text" rounded="true" size="small">SignIn</v-btn>
        <v-btn prepend-icon="mdi-logout" variant="text" rounded="true" size="small">SignOut</v-btn>
      </v-toolbar-items>
      
    </v-toolbar> 
    <slot />
</template>