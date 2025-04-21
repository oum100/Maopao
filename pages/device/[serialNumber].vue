<template>
  <div>

    <!-- 📃 Device Info -->
    <v-card class="mb-4" color="indigo" >
      <v-card-title>Device: {{ serialNumber }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6"><strong>Model:</strong> {{ device?.model }}</v-col>
          <v-col cols="12" sm="6"><strong>Version:</strong> {{ device?.version }}</v-col>
          <v-col cols="12" sm="6"><strong>Unit:</strong> {{ device?.unit?.name }}</v-col>
          <v-col cols="12" sm="6"><strong>Language:</strong> {{ device?.language?.name }}</v-col>
          <v-col cols="12" sm="6"><strong>Test Mode:</strong> {{ device?.testMode?.name }}</v-col>
        </v-row>
      </v-card-text>
    </v-card>

        <!-- 🔙 Back Button -->
        <v-row class="ma-1 justify-start">
      <v-col cols="12" class="text-start">
        <NuxtLink to="/device">
          <v-btn size="small" prepend-icon="mdi-arrow-left" variant="outlined">
            Back to Device List
          </v-btn>
        </NuxtLink>
      </v-col>
    </v-row>


    <!-- 🧪 Filters + Quick Date Filter (horizontal & centered) -->
    <v-row class="mb-4 justify-center align-center flex-wrap" dense>
      <v-col cols="auto">
        <v-text-field v-model="filters.min" label="Min Alcohol" type="number" clearable density="compact" hide-details />
      </v-col>
      <v-col cols="auto">
        <v-text-field v-model="filters.max" label="Max Alcohol" type="number" clearable density="compact" hide-details />
      </v-col>
      <v-col cols="auto">
        <v-text-field v-model="filters.startDate" label="Start Date" type="date" clearable density="compact" hide-details />
      </v-col>
      <v-col cols="auto">
        <v-text-field v-model="filters.endDate" label="End Date" type="date" clearable density="compact" hide-details />
      </v-col>
      <v-col cols="auto" class="d-flex align-center ga-2">
        <v-btn size="small" variant="tonal" @click="setQuickDate('today')">Today</v-btn>
        <v-btn size="small" variant="tonal" @click="setQuickDate('7days')">Last 7 Days</v-btn>
        <v-btn size="small" variant="tonal" @click="setQuickDate('month')">This Month</v-btn>
        <v-btn size="small" variant="text" color="red" @click="clearDateFilter()">Clear</v-btn>
      </v-col>
    </v-row>

    <!-- 📈 Chart -->
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" sm="10" md="8">
        <v-card>
          <v-card-title>Alcohol Trend</v-card-title>
          <v-card-text>
            <div style="width: 70%; height: 500px; margin: 0 auto; position: relative;">
              <line-chart :data="chartDataTest2" :options="chartOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 📊 Record Table -->
    <v-data-table-server
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="records"
      :items-length="total"
      :loading="loading"
      @update:options="load"
      class="elevation-1"
    >
      <template #item.dateTime="{ item }">
        {{ new Date(item.dateTime).toLocaleString('th-TH', {
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
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-date-fns'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  TimeScale,
  TimeSeriesScale,
  Decimation,
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import { useTestRecordTable } from '@/composables/useTestRecordTable'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  TimeScale,
  TimeSeriesScale,
  Decimation,
)

const route = useRoute()
const serialNumber = route.params.serialNumber as string
const device = ref<any>(null)

const {
  records,
  total,
  loading,
  page,
  itemsPerPage,
  sortBy,
  filters,
  load,
} = useTestRecordTable(serialNumber)

const headers = [
  { title: 'Date Time', key: 'dateTime' },
  { title: 'Record #', key: 'recordNumber' },
  { title: 'Alcohol Value', key: 'alcoholValue' },
  { title: 'Unit', key: 'unit.name' },
]

const chartOptions = ref<ChartOptions<'line'>>({
  responsive: true,
  interaction: {
    mode: 'nearest',
    intersect: false,
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        displayFormats: {
          minute: 'HH:mm',
        },
      },
      adapters: {
        date: {
          zone: 'Asia/Bangkok',
        },
      },
      title: {
        display: true,
        text: 'Time (HH:mm)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Alcohol',
      },
    },
  },
})

const chartDataTest2 = ref<ChartData<'line'>>({
  labels: [],
  datasets: [],
})

function updateChart() {
  chartDataTest2.value = {
    labels: records.value.map((r: any) => new Date(r.dateTime)),
    datasets: [
      {
        label: serialNumber,
        data: records.value.map((r: any) => r.alcoholValue),
        fill: false,
        tension: 0.3,
        borderColor: '#42A5F5',
        backgroundColor: '#90CAF9',
      },
    ],
  }
}

watch(records, updateChart, { immediate: true })

watch(filters, () => {
  page.value = 1
  load()
}, { deep: true })

function setQuickDate(type: 'today' | '7days' | 'month') {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const format = (d: Date) => d.toISOString().slice(0, 10)

  if (type === 'today') {
    filters.value.startDate = format(today)
    filters.value.endDate = format(today)
  } else if (type === '7days') {
    const past = new Date()
    past.setDate(today.getDate() - 6)
    filters.value.startDate = format(past)
    filters.value.endDate = format(today)
  } else if (type === 'month') {
    const first = new Date(today.getFullYear(), today.getMonth(), 1)
    filters.value.startDate = format(first)
    filters.value.endDate = format(today)
  }
}

function clearDateFilter() {
  filters.value.startDate = ''
  filters.value.endDate = ''
}

onMounted(async () => {
  await load()
  const res = await fetch(`/api/v1.0.0/device/${serialNumber}`)
  const data = await res.json()
  device.value = data.device
})
</script>

<script lang="ts">
export default {
  components: {
    LineChart: Line,
  },
}
</script>
