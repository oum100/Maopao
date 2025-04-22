<template>
  <div>
    <div v-if="data">
        Hello {{ data?.user?.name }}!
    </div>
    <div v-else>
        You are not logged in.
    </div>
  </div>
  <div>
    <button @click="() => getSession()">
        Refresh
    </button>
    <button @click="() => getSession({ required: true })">
        Refresh or trigger signin
    </button>
  </div>
</template>

<script lang="ts" setup>
    const { status, data } = useAuth()
    const { getSession } = useAuth()
</script>

<style>

</style>

