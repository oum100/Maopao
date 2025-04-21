<template>
    <v-dialog v-model="modelValue" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">
          {{ editItem ? editTitle : addTitle }}
        </v-card-title>
  
        <v-card-text>
          <v-text-field
            v-model="form.code"
            label="Code"
            type="number"
            :disabled="!!editItem"
            required
          />
          <v-text-field
            v-model="form.name"
            label="Name"
            required
          />
        </v-card-text>
  
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue" @click="save">Save</v-btn>
          <v-btn color="grey" @click="modelValue=false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, watch } from 'vue'

  interface Data {
    code:number,
    name:string
  }
  
  const props = defineProps<{
    modelValue: boolean
    editItem?: Data | null
    title: string
    resource:string
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'refresh'): void
  }>()
  
  const modelValue = ref(props.modelValue)
  const dialogTitle = ref(props.title)
  const editTitle = "Edit " + dialogTitle.value
  const addTitle = "Add " + dialogTitle.value
  const resource = ref(props.resource)
  
  watch(
    () => props.modelValue,
    (newValue) => {
      // console.log("newValue: ",newValue)
      modelValue.value = newValue
    }
  )
  
  watch(modelValue,(newValue) => {
      if(!newValue) resetForm()
      emit('update:modelValue', newValue)
    }
  )

  const form = reactive<Partial<Data>>({
    code: undefined,
    name: '',
  })
  
// รีเซตฟอร์มเมื่อ editItem เปลี่ยน
watch(
  () => props.editItem,
  (val) => {
    if (val) {
      Object.assign(form, val)
    } else {
      resetForm()
    }
  },
  { immediate: true }
)
  
  async function save() {
    if (!form.name || form.code === undefined) return
  
    if (props.editItem) {
      await $fetch(`/api/v1.0.0/${resource.value}/${form.code}`, {
        method: 'PUT',
        body: {
          name: form.name,
        },
      })
    } else {
      await $fetch(`/api/v1.0.0/${resource.value}/create`, {
        method: 'POST',
        body: form
      })
    }
  
    emit('refresh')
    modelValue.value = false
    // resetForm()
  }

  function resetForm(){
    form.code = undefined
    form.name = ''
    modelValue.value = false
  }

  function close() {
    modelValue.value = !modelValue.value
  }

  // await $fetch(`/api/v1.0.0/${resource}/${code}`, { method: 'DELETE' })
  </script>
  
  