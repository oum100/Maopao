<template>
  <v-container fluid>
    <div class="d-flex flex-row justify-space-around">
      <div class="text-h5 font-weight-bold font-noto-sans mr-6">Device Management </div>

      <v-select
        class="mx-2"
        v-model="filters.model"
        :items="filterOptions.models"
        label="Model"
        density="compact"
      />

      <v-select
        class="mx-2"
        v-model="filters.version"
        :items="filterOptions.versions"
        label="Version"
        density="compact"
      />

      <v-select
        class="mx-2"
        v-model="filters.unitId"
        :items="filterOptions.units"
        item-title="name"
        item-value="id"
        label="Unit"
        density="compact"
      />

      <v-select
        class="mx-2"
        v-model="filters.testModeId"
        :items="filterOptions.testModes"
        item-title="name"
        item-value="id"
        label="Test Mode"
        density="compact" 
      />      

      <v-btn color="primary" @click="importDialog = true" class="mx-2">
            <v-icon start>mdi-upload</v-icon>
            Import Devices
      </v-btn>
      <v-btn color="primary" @click="exportToCSV" class="ml-auto mx-2">
        Export CSV
      </v-btn>
    </div>

    <div>
      <!-- ✨ Filter Bar -->

 

    

      <!-- 📊 Device Table -->
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="items"
        :items-length="total"
        :loading="loading"
        @update:options="load"
        class="elevation-1"
      >
        <template #item.serialNumber="{ item }">
          <NuxtLink :to="`/device/${item.serialNumber}`">
            <strong class="text-primary">{{ item.serialNumber }}</strong>
          </NuxtLink>
        </template>

        <template #item.action="{ item }">
          <v-btn
            icon
            variant="text"
            color="primary"
            @click="editDevice(item)"   
            :disabled="true"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn
            icon
            variant="text"
            color="error"
            @click="deleteDevice(item)"
            :disabled="item.records?.length > 0"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>

          <v-tooltip text="History">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                color="primary"
                :to="`/device/${item.serialNumber}`"
              >
                <v-icon>mdi-chart-line</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
        <template #item.createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleString('th-TH') }}
        </template>
      </v-data-table-server>
    </div>

    <v-dialog v-model="importDialog" max-width="500">
      <v-card>
        <v-card-title>Import Devices from Excel/CSV</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="uploadFile"
            label="Choose Excel or CSV file"
            accept=".csv,.xlsx,.xls"
            prepend-icon="mdi-file-upload"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="importDialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text :disabled="!uploadFile" @click="handleImport">Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>  
  </v-container>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useDeviceTable } from '@/composables/useDeviceTable'
  import Swal from 'sweetalert2' // optional toast plugin

  definePageMeta({ auth: false })

  interface DeviceFilterResponse {
    models: string[]
    versions: string[]
    units: { id: number; name: string }[]
    testModes: { id: number; name: string }[]
  }

  

  const {
    items,
    total,
    loading,
    page,
    itemsPerPage,
    sortBy,
    filters,
    load,
    exportToCSV,
  } = useDeviceTable()

  const headers = [
    { title: 'Serial Number', key: 'serialNumber' },
    { title: 'Mac Address', key: 'macAddress' },
    { title: 'Model', key: 'model' },
    { title: 'Version', key: 'version' },
    { title: 'Unit', key: 'unit.name' },
    { title: 'Language', key: 'language.name' },
    { title: 'Test Mode', key: 'testMode.name' },
    { title: 'Created At', key: 'createdAt' },
    { title: 'Actions', key: 'action', sortable: false },
  ]

  // 🔽 ตัวเลือกใน dropdown filter
  const filterOptions = ref<DeviceFilterResponse>({
    models: [],
    versions: [],
    units: [],
    testModes: [],
  })

  const uploadFile = ref<File | null>(null)
  const importDialog = ref(false)
  

  // 🔄 โหลด filter options และ table data
  onMounted(async () => {
    await load()

    const data  = await $fetch<DeviceFilterResponse>('/api/v1.0.0/device/filters')
    if (data) {
      filterOptions.value.models = data.models || []
      filterOptions.value.versions = data.versions || []
      filterOptions.value.units = data.units || []
      filterOptions.value.testModes = data.testModes || []
    }
  })

  // 📌 รีโหลดเมื่อ filter เปลี่ยน
  watch(filters, () => {
    page.value = 1
    load()
  }, { deep: true })

  // 🗑 ฟังก์ชันลบอุปกรณ์
  const deleteDevice = async (device: any) => {
    const confirmed = confirm(`Are you sure to delete device ${device.serialNumber}?`)
    if (!confirmed) return

    try {
      await $fetch(`/api/v1.0.0/device/${device.serialNumber}`, {
        method: 'DELETE',
      })
      await load()

      // ✅ ถ้าไม่มี item แล้ว และอยู่หน้าหลังหน้าแรก → กลับไปหน้าเดิม
      if (items.value.length === 0 && page.value > 1) {
        console.log("delete last record")
        page.value -= 1
        await load()
      }      

    } catch (err) {
      alert('Failed to delete device. It may still be in use.')
    }
  }

  const editDevice = async(device:any)=>{
    
  }

  const handleImport = async () => {
    if (!uploadFile.value) return

    const formData = new FormData()
    formData.append('file', uploadFile.value)

    try {
      const res = await $fetch<{ success: boolean; inserted: number }>('/api/v1.0.0/device/import', {
        method: 'POST',
        body: formData,
      })

      importDialog.value = false
      uploadFile.value = null

      await Swal.fire({
        icon: 'success',
        title: 'Import Complete',
        text: `Successfully imported ${res.inserted} devices.`,
        customClass: {
          confirmButton: 'text-white bg-green',
        }
      })

      // refreshDeviceList() // your existing method
      await load()
    } catch (err: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Import Failed',
        text: err?.data?.message || 'Unable to import devices.',
        // customClass: {
        //   confirmButton: 'text-white',
        // }
      })
    }
  }  

  
</script>
