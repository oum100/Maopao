<script setup lang="ts">
    const { status, data: session, signIn, signOut } = useAuth()
</script>

<template>
  <div>
    <div v-if="status === 'authenticated'">
      Hello {{ session?.user?.email }}
      <q-btn @click="signOut()" label="Logout" />
    </div>
    <div v-else>
      <q-btn @click="signIn('github')" label="Login with GitHub" />
    </div>
  </div>
</template>
