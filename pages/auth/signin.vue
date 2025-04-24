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


        <v-btn class="my-4" color="blue" size="large" variant="tonal" block @click="signIn('credentials',form)">Sign In</v-btn>

        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            href="/auth/register"
            rel="noopener noreferrer"
            target="_self"
          >Sign up now<v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-card>
    </div>
  </template>

  <script setup lang="ts">
    definePageMeta({
      auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
      layout:'auth'
    })

    const { status, data: session, signIn, signOut } = useAuth()
    const visible = ref(false)
    const demoCredentials = { email: 'jsmith', password: 'hunter2' }
    const form = ref({
      email:'',
      password: '',
      redirect:true,
      callbackUrl:'/device'
    })

    const rules = {
    required: (value:string) => !!value || 'Required.',
    counter: (value:string) => value.length <= 20 || 'Max 20 characters',
    password:(value:string) => {
      const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/
      return pattern.test(value) || 'Invalid password'
    },
    email: (value:string) => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || 'Invalid e-mail.'
    },
  }


  </script>