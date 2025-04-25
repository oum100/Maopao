<template>
    <div>
      <v-img
        class="mx-auto my-6"
        max-width="250"
        src="../../assets/images/Maopao4-removebg.png">
      </v-img>
  
      <v-card
        class="mx-auto pa-12 pb-12"
        elevation="8"
        max-width="448"
        rounded="lg"
      >

        <v-divider class="my-4">Social Signin</v-divider>
        <v-sheet class="d-flex justify-center" >
            <div>
                <v-btn class="mx-4" color="grey-lighten-2" icon="mdi-github" @click="signIn('github')"></v-btn>
                <v-btn class="mx-4" color="grey-lighten-2" icon="mdi-google" @click="signIn('google')"></v-btn>
            </div>
        </v-sheet>
        <v-divider class="my-4"></v-divider>

        <v-form @submit.prevent="onSubmit" v-model="valid">
          <div class="text-subtitle-1 text-medium-emphasis">Email</div>
          <v-text-field
            v-model="form.email"
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            :rules="[rules.required,rules.email]"
          ></v-text-field>
    
          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Password
    
            <a
              class="text-caption text-decoration-none text-blue"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              Forgot login password?</a>
          </div>
    
          <v-text-field
            v-model="form.password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            :rules="[rules.required, rules.password]"
            hint="8+ chars, 1 uppercase, 1 number, 1 special char."
            @click:append-inner="visible = !visible"
          ></v-text-field>
    
          <!-- <v-card class="mb-4" color="surface-variant" variant="tonal">
            <v-card-text class="text-medium-emphasis text-caption">
              Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
            </v-card-text>
          </v-card> -->


          <!-- <v-btn class="my-4" color="blue" size="large" variant="tonal" block @click="signIn('credential',form)">Sign In</v-btn> -->
          <v-btn :disabled="!valid || loading" :loading="loading" type="submit" block color="primary">
            Sign In
          </v-btn>
        </v-form>


        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            href="/auth/signup"
            rel="noopener noreferrer"
            target="_self"
          >Sign up now<v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-card>
    </div>
  </template>

  <script setup lang="ts">
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const valid = ref(false)
    import Swal from 'sweetalert2'
    // const errorActive = ref(true)

    definePageMeta({
      auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
      layout:'auth'
    })

    const { status, data: session, signIn, signOut } = useAuth()
    const visible = ref(false)
    const form = ref({
      email:'',
      password: '',
      redirect:true,
      callbackUrl:'/device'
    })

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

    // 🔴 Read error code from URL (e.g. /login?error=CredentialsSignin)
    const errorCode = computed(() => route.query.error)

    // console.log("errorCode: ",errorCode)

    const errorMap: Record<string, string> = {
      CredentialsSignin: 'Invalid email or password.',
      OAuthAccountNotLinked: 'This account is already linked to another method.',
      AccessDenied: 'Access denied.',
      Verification: 'Invalid or expired login link.',
      Configuration: 'Server configuration error.',
      Default: 'Login failed. Please try again.',
    }

    const errorMessage = computed(() => {
      return errorCode.value
        ? errorMap[errorCode.value as string] ?? errorMap.Default
        : ''
    })

    // if(errorCode.value){
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Authorization Failed',
    //       text: errorMessage.value,
    //       timer: 3000,
    //       showConfirmButton: false,
    //       position: 'top',
    //     })
    // }


 
    // async function handleSignin(){

    //   console.log("formLogin: ",form.value)

    //   const result = await signIn('credentials',form.value)

    //   console.log("Login result: ",result)
    // }

  const onSubmit = async () => {
    loading.value = true

      // เคลียร์ error ก่อน submit ใหม่
    // const query = { ...route.query }
    // delete query.error
    // router.replace({ query }) // ลบ error query param ออกจาก URL

    const result = await signIn('credentials', {
      email: form.value.email,
      password: form.value.password,
      redirect: false,
      callbackUrl: '/device', // or any page after login
    })

    loading.value = false

    if (result?.error) {
      console.error('Login error:', result.error)
      await Swal.fire({
        icon: 'error',
        title: 'Authorization Failed',
        text: errorMessage.value,
        timer: 2500,
        showConfirmButton: false,
        position: 'top',
      })
    }else{
      router.push('/device')
    }
  }

  </script>