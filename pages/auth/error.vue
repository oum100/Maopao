<template>
  <!-- <v-sheet width="500" class="mx-auto mt-8">
    <v-alert closable
    title="Authentication Failed"
    text="..."
    type="error"
    @click:close="handleCloseAlert"
    >
    {{ errorCode }}
    </v-alert>
  </v-sheet> -->

</template>


<script setup lang="ts">
  import Swal from 'sweetalert2'
  definePageMeta({
    auth: { unauthenticatedOnly: false, navigateAuthenticatedTo: '/' },
  })

  const route = useRoute()
  const router = useRouter()
  const errorCode = computed(() => route.query.error)

  if (typeof errorCode.value === 'string') {
  
    Swal.fire({
      icon: 'error',
      title: 'Authentication Failed',
      text: errorCode.value,
      timer: 2000,
      showConfirmButton: false,
      position: 'top',
    })
  } else {
    console.error('Invalid errorCode:', errorCode.value)
  }

  const handleCloseAlert = () =>{
    router.push('/auth/singin')
  }
</script>

