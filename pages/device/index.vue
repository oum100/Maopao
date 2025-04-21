<template>
  <div>
    <!-- ✨ Filter Bar -->
    <v-row class="mt-2 mb-4 ml-2" dense>
      <v-col cols="12" sm="2">
        <v-select
          v-model="filters.model"
          :items="filterOptions.models"
          label="Model"
          clearable
          density="compact"
        />
      </v-col>

      <v-col cols="12" sm="2">
        <v-select
          v-model="filters.version"
          :items="filterOptions.versions"
          label="Version"
          clearable
          density="compact"
        />
      </v-col>

      <v-col cols="12" sm="2">
        <v-select
          v-model="filters.unitId"
          :items="filterOptions.units"
          item-title="name"
          item-value="id"
          label="Unit"
          clearable
          density="compact"
        />
      </v-col>

      <v-col cols="12" sm="3">
        <v-select
          v-model="filters.testModeId"
          :items="filterOptions.testModes"
          item-title="name"
          item-value="id"
          label="Test Mode"
          clearable
          density="compact"
        />
      </v-col>

      <v-col cols="12" sm="3" class="d-flex align-center justify-end">
        <v-btn color="primary" @click="exportToCSV" class="ml-auto">
          Export CSV
        </v-btn>
      </v-col>
    </v-row>

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
          :to="`/device/${item.serialNumber}?edit=true`"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="text"
          color="error"
          @click="deleteDevice(item)"
          :disabled="item.testRecords?.length > 0"
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
        {{ new Date(item.createdAt).toLocaleString('th-TH', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }) }}
      </template>

    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useDeviceTable } from '@/composables/useDeviceTable'
import { useFetch } from '#app'

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

// 🔄 โหลด filter options และ table data
onMounted(async () => {
  await load()

  const { data } = await useFetch<DeviceFilterResponse>('/api/v1.0.0/device/filters')
  if (data.value) {
    filterOptions.value.models = data.value.models || []
    filterOptions.value.versions = data.value.versions || []
    filterOptions.value.units = data.value.units || []
    filterOptions.value.testModes = data.value.testModes || []
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
    load()
  } catch (err) {
    alert('Failed to delete device. It may still be in use.')
  }
}
</script>
