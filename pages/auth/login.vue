<template>
    <v-container class="d-flex justify-center align-center" style="height: 100vh">
      <v-card class="pa-4" width="400">
        <v-card-title class="text-h5">Login</v-card-title>
        <v-card-text>
          <v-btn block class="mb-2" @click="login('github')">Login with GitHub</v-btn>
          <v-btn block class="mb-4" @click="login('google')">Login with Google</v-btn>
  
          <v-text-field v-model="email" label="Email" />
          <v-text-field v-model="password" type="password" label="Password" />
          <v-btn block class="mt-2" @click="submit">Login</v-btn>
          <v-btn text @click="$router.push('/auth/forgot')">Forgot Password?</v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  const email = ref('');
  const password = ref('');
  
  const login = async (provider: string) => {
    // await signIn(provider);
  };
  
  const submit = async () => {
    // await signIn('credentials', { email: email.value, password: password.value });
  };
  </script>
  