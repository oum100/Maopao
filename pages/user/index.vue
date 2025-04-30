<template>
    <v-container fluid>
      <div class="d-flex flex-row">
        <div class="d-flex flex-column">
          <span class="font-weight-bold text-h5 font-noto-sans">User Management </span>
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
            <td>{{ item.uuid }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
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
                @click="deleteItem(item.email)"
                :disabled="(item._count.devices !=  0)"
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
        title="User"
        @refresh="refresh"
        resource="user"
      />      

    </v-container>
</template>

<script setup lang="ts">
    // import { useUserTable } from '@/composables/useUserTable'
    import { useMasterTable } from '@/composables/useMasterTable'
    import unitDialog from '@/components/userDialog.vue'

    definePageMeta({ auth: false })

    interface User {
      uuid:string,
      name:string,
      email:string,
      createdAt:Date,
      updatedAt:Date,
      _count:{
        devices:number
      }
    }

    const headers = [
      { title: 'UUID', key: 'uuid' },
      { title: 'Name', key: 'name' },
      { title: 'Email', key: 'email' },
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
    } = useMasterTable<User>('user')


    const showDialog = ref(false)
    const editItem = ref<User | null>(null)

    function edit(item: User) {
        console.log("Item: ",item)
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