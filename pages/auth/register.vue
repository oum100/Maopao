<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="250"
      src="../../assets/images/Maopao4-removebg.png"></v-img>
    <v-card
      class="mx-auto pa-12 pb-12"
      elevation="8"
      max-width="448"
      rounded="lg"
    >

    <!-- <v-divider class="my-4">Social SignUp</v-divider>
      <v-sheet class="d-flex justify-center" >
          <div>
              <v-btn class="mx-4" color="grey-lighten-2" icon="mdi-github" @click="signIn('github')"></v-btn>
              <v-btn class="mx-4" color="grey-lighten-2" icon="mdi-google" @click="signIn('google')"></v-btn>
          </div>
      </v-sheet>

    <v-divider class="my-4"></v-divider> -->

    <div class="text-subtitle-1 text-medium-emphasis">Name</div>
      <v-text-field
        v-model="form.name"
        density="compact"
        placeholder="Name"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        hint="MAX 30 Charactors"
        :rules="[rules.required,rules.counter]"
      ></v-text-field>
    
    <div class="text-subtitle-1 text-medium-emphasis">Email</div>
      <v-text-field
        v-model="form.email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        type="email"
        :rules="[rules.required,rules.email]"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
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


      <v-btn class="my-4" color="blue" size="large" variant="tonal" block @click="handleRegister(form)">Registration</v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="/auth/signin"
          rel="noopener noreferrer"
          target="_self"
        >Sign In now<v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </div>
  <v-card class="d-flex mx-auto bg-blue-lighten-3"width="300">
    <v-alert
      v-model="validInput"
      border="start"
      close-label="Register Failed"
      color="deep-purple-accent-4"
      title="Registration Failed"
      variant="tonal"
      closable
    >
    Aenean imperdiet. Quisque id odio. Cras dapibus. Pellentesque ut neque. Cras dapibus.

    Vivamus consectetuer hendrerit lacus. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur blandit mollis lacus. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.
    </v-alert>
  </v-card>

</template>

<script setup lang="ts">
  import {validateRegister} from '@/models/user'

  definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
    layout:'auth'
  })

  const { status, data: session, signIn, signOut } = useAuth()
  const visible = ref(false)
  const validInput = ref(false)

  const form = ref({
    name:'',
    email:'',
    password: '',
    redirect:false,
    callbackUrl:'/device'
  })

  const rules = {
    required: (value:string) => !!value || 'Required.',
    counter: (value:string) => value.length <= 30 || 'Max 30 characters',
    password:(value:string) => {
      const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/
      return pattern.test(value) || 'Invalid password'
    },
    email: (value:string) => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || 'Invalid e-mail.'
    },
  }

  async function handleRegister(form:any){
    const isValid = validateRegister(form)

    if(!isValid){
      validInput.value = false
    }else{
      validInput.value= true
    }
    
    
    console.log("form data",form)
  }


</script>