<template>
    <div>
      <!-- โลโก้ -->
      <v-img
        class="mx-auto my-6"
        max-width="250"
        src="../../assets/images/Maopao4-removebg.png"
      ></v-img>
  
      <!-- กล่องฟอร์ม -->
      <v-card class="mx-auto pa-12 pb-12" elevation="8" max-width="448" rounded="lg">
        <v-form ref="formRef">
          <!-- Name -->
          <div class="text-subtitle-1 text-medium-emphasis">Name</div>
          <v-text-field
            v-model="form.name"
            placeholder="Name"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="compact"
            :rules="[rules.required, rules.nameLength]"
            hint="Name must be 2–30 characters"
            clearable
          />
  
          <!-- Email -->
          <div class="text-subtitle-1 text-medium-emphasis">Email</div>
          <v-text-field
            v-model="form.email"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="compact"
            type="email"
            :rules="[rules.required, rules.email]"
            hint="abc@example.com"
            clearable
          />
  
          <!-- Password -->
          <div class="text-subtitle-1 text-medium-emphasis">Password</div>
          <v-text-field
            v-model="form.password"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            placeholder="Enter your password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            density="compact"
            :rules="[rules.required, rules.password]"
            hint="8+ chars, 1 uppercase, 1 number, 1 special char."
            clearable
          />
  
          <!-- ปุ่ม -->
          <v-btn
            class="my-4"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="handleSignup"
          >
            Registration
          </v-btn>
        </v-form>
  
        <!-- ลิงก์ Sign in -->
        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            href="/auth/signin"
            rel="noopener noreferrer"
            target="_self"
          >
            Sign In now <v-icon icon="mdi-chevron-right" />
          </a>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
    layout: 'auth'
  })
  
  import { ref } from 'vue'
  import Swal from 'sweetalert2'
  
  const form = ref({
    name: '',
    email: '',
    password: '',
    redirect:'false',
    callbackUrl:'/device'
  })
  
  const formRef = ref()
  const showPassword = ref(false)
  const router = useRouter()
  
  const rules = {
    required: (v: string) => !!v || 'Required.',
    nameLength: (v: string) =>
      v.length > 1 && v.length <= 30 ,
    email: (v: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(v) || 'Invalid email format'
    },
    password: (v: string) => {
      const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/
      return pattern.test(v) || 'Invalid password format.'
    }
  }
  
  async function handleSignup() {
    const isValid = await formRef.value?.validate()
    if (!isValid?.valid) {
      alert('Invalid input')
      return
    }
  
    // ต่อ API ได้ตรงนี้เลย
    const {status, error} = await useFetch('/api/auth/register',{
        method: 'POST',
        body: form.value
    })

    if(status.value == "error"){
      // push.error(error.value?.statusMessage as string)
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.value?.statusMessage ,
        timer: 2000,
        showConfirmButton: false,
        position: 'top',
      })

      throw createError({
        statusCode:500,
        statusMessage:error.value?.statusMessage
      })
    }


    Swal.fire({
      icon: 'success',
      title: `Welcome ${form.value.name}`,
      text: 'Please check your email for confirmation.',
      // timer: 3000,
      showConfirmButton: true,
      position: 'top',
      customClass: {
        confirmButton: 'text-white bg-green-600',
      }
    })
    router.push('/')
    // console.log('✅ Valid form:', form.value)
    // alert('🎉 Registration complete!')
  }
  </script>
  