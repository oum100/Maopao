<template>
  <v-sheet width="500" class="mx-auto mt-8">
    <v-alert closable
    title="Authentication Failed"
    text="..."
    type="error"
    @click:close="handleCloseAlert"
    >
    {{ errorCode }}
    </v-alert>
  </v-sheet>

</template>


<script setup lang="ts">
  definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
  })

  const route = useRoute()
  const router = useRouter()
  const errorCode = computed(() => route.query.error)
  const handleCloseAlert = () =>{
    router.push('/login')
  }
</script>

