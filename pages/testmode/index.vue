<template>
  <v-container fluid>
    <div>
      <div class="mx-4">
        <h1>TestMode Management</h1>
      </div>
      <div class="d-flex flex-row justify-end mb-3">
        <div class="d-flex flex-column mx-2 my-2 "><v-btn rounded="xl" width="150" @click="exportExcel" color="primary"
            block>Export</v-btn></div>
        <div class="d-flex flex-column mx-2 my-2"><v-btn rounded="xl" width="150" @click="addItem" color="success"
            block>Add</v-btn></div>
      </div>
    </div>

    <!-- Table -->
    <v-data-table item-value="code" class="elevation-1" 
      :header="headers"
      :items="rows" 
      :loading="pending" 
      :items-per-page="pageSize" 
      :page.sync="page"
      :server-items-length="total" 
      v-model:sort-by="sortBy"
      >
      <template #item="{ item }">
        <tr>
          <td>{{ item.code }}</td>
          <td>{{ item.name }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td class="text-center">
            <v-btn icon variant="text" color="primary" @click="edit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn icon variant="text" color="error" @click="deleteItem(item.code)"
              :disabled="item._count.devices != 0">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Dialog -->
    <test-mode-dialog v-model="showDialog" :editItem="editItem" title="TestMode" @refresh="refresh" resource="testMode"/>
  </v-container>
</template>

<script setup lang="ts">
import { useMasterTable } from '@/composables/useMasterTable'
// import type { Language } from '@prisma/client'
import testModeDialog from '@/components/Dialog.vue'

interface DataInfo {
  code: number,
  id: number,
  name: string,
  createdAt: Date,
  updatedAt: Date,
  _count: {
    devices: number
  }
}

const headers = [
  { title: 'Code', key: 'code' },
  { title: 'Name', key: 'name' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Actions', key: 'action', sortable: false },
]

const {
  page,
  pageSize,
  nameFilter,
  rows,
  total,
  pending,
  sortBy,
  refresh,
  exportExcel,
  deleteItem
} = useMasterTable<DataInfo>('testMode')

const showDialog = ref(false)
const editItem = ref<DataInfo | null>(null)


function edit(item: DataInfo) {
  editItem.value = item
  showDialog.value = true
}

function addItem() {
  editItem.value = null
  showDialog.value = true
}


function formatDate(date: string | Date) {
  return new Date(date).toLocaleString()
}
</script>