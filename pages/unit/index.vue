<template>
    <v-container fluid>
      <div class="d-flex flex-row">
        <div class="d-flex flex-column">
          <span class="font-weight-bold text-h5 font-noto-sans">Unit Management </span>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex flex-column px-2">
          <v-btn rounded="xl" @click="exportExcel" color="primary" block width="150">Export</v-btn>
        </div>
        <div class="d-flex flex-column px-2">
          <v-btn rounded="xl" width="150" @click="addItem" color="success" block>Add</v-btn>
        </div>
      </div>
    
  
      <!-- Table -->
      <v-data-table item-value="code" class="elevation-1"
        :headers="headers"
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
            <td>{{ formatDate(item.updatedAt) }}</td>
            <td class="text-center">
              <v-btn 
                icon
                variant="text"
                color="primary" 
                @click="edit(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                icon
                variant="text"
                color="error"
                @click="deleteItem(item.code)"
                :disabled="(item._count.devices !=  0) && (item._count.records != 0)"
              >
                  <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
  
      <!-- Dialog -->
      <unit-dialog
        v-model="showDialog"
        :editItem="editItem"
        title="Unit"
        @refresh="refresh"
        resource="unit"
      />
    </v-container>
  </template>
  
  <script setup lang="ts">
    import { useMasterTable } from '@/composables/useMasterTable'
    import unitDialog from '@/components/Dialog.vue'

    definePageMeta({ auth: false })

    interface Unit {
      code:number,
      id:number,
      name:string,
      createdAt:Date,
      updatedAt:Date,
      _count:{
        devices:number
        records:number
      }
    }
 
    const headers = [
      { title: 'Code', key: 'code' },
      { title: 'Name', key: 'name' },
      { title: 'Created At', key: 'createdAt' },
      { title: 'Updated At', key: 'updatedAt' },
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
    } = useMasterTable<Unit>('unit')
    
    const showDialog = ref(false)
    const editItem = ref<Unit | null>(null)

    function edit(item: Unit) {
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
  