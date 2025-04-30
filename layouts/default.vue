<template>
  
    <v-toolbar class="text-white" density="compact" image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
      <v-container class="d-flex justify-start align-center" fluid>
      <v-btn icon="mdi-menu"></v-btn>

      
        <v-img
          src="../assets/images/Maopao4-removebg.png"
          alt="Maopao Logo"
          max-width="70"
        />
      <!-- </v-container>   -->
      <!-- <v-toolbar-title>Alcohol Breathalyzer</v-toolbar-title> -->
    
      <!-- <v-toolbar-title>
        <v-btn class="text-weight-black" href="/">MAOPAO</v-btn>
      </v-toolbar-title> -->
      <!-- <v-toolbar-title class="text-wight-black"><div>MAOPAO</div></v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to="/device" prepend-icon="mdi-chart-line">Device</v-btn>
        <v-btn to="/language" prepend-icon="mdi-penguin">Language</v-btn>
        <v-btn to="/unit" prepend-icon="mdi-cards">Unit</v-btn>
        <v-btn to="/testmode" prepend-icon="mdi-chair-rolling">TestMode</v-btn>
        <v-btn to="/test" prepend-icon="mdi-alien">Test</v-btn>
        <v-btn to="/user" prepend-icon="mdi-account-group">User</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <!-- <v-toolbar-items> -->
        <div v-if="status === 'authenticated'">
          <!-- Hello {{ session?.user?.email }}
          <q-btn @click="signOut()" label="Logout" /> -->
          <v-btn prepend-icon="mdi-logout" variant="text" @click="signOut({ callbackUrl: '/' })">SignOut</v-btn>
        </div>
        <div v-else>
          <!-- <q-btn @click="signIn('github')" label="Login with GitHub" /> -->
          <v-btn prepend-icon="mdi-login" variant="text" to="/auth/signin">SignIn</v-btn>
          <v-btn prepend-icon="mdi-login" variant="text" to="/auth/signup">Signup</v-btn>
        </div>
      <!-- </v-toolbar-items> -->
    </v-container> 
    </v-toolbar> 
  
    <slot />
</template>
<script setup lang="ts">
  const {status,data,signIn, signOut } = useAuth()

  
</script>