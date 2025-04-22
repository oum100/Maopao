<template>
    <div>
        <v-card 
            class="mx-auto pa-4 mt-10" 
            elevation="16"
            prepend-icon="$vuetify"
            subtitle="The #1 Alcohol Brethaltilizer"
            width="600"
            height="700"
        >
            <template v-slot:title>
                <span class="font-weight-black">Welcome to Maopao</span>
            </template>
            <v-card-text  class="pt-4">
                <v-sheet class="d-flex justify-center rounded-lg" color="grey-lighten-3" height="70">
                    <div class="d-flex align-center">
                        <v-btn class="mx-2" color="grey-darken-2"><v-icon size="30">mdi-github</v-icon></v-btn>
                        <v-btn class="mx-2" color="primary"><v-icon size="30">mdi-google</v-icon></v-btn>
                    </div>
                </v-sheet>

            </v-card-text>
        </v-card>  
        <!-- <v-sheet  class="pa-6 text-white mx-auto" max-width="600">
 
        </v-sheet> -->
 
    </div>
</template>

<script setup lang="ts">
    definePageMeta({ auth: false })

</script>

<style scoped>

</style>