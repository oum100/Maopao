// composables/useTestRecordTable.ts
import { ref, watch } from "vue";
import { useFetch } from "#app";
import type { ChartData } from "chart.js";

interface Unit {
  name: string;
}

interface TestRecord {
  recordNumber: number;
  alcoholValue: number;
  dateTime: string;
  unit: Unit;
}

interface DeviceResponse {
  device: any;
  records: TestRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}



export function useTestRecordTable(serialNumber: string) {
  const records = ref<TestRecord[]>([]);
  const total = ref<number>(0);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const itemsPerPage = ref<number>(10);
  const sortBy = ref([{ key: "dateTime", order: "desc" as const }]);

  const filters = ref({
    min: "",
    max: "",
    startDate: "",
    endDate: "",
  });

  const chartData = ref<ChartData<'line'>>({
    labels: [] as string[],
    datasets: [
      {
        label: "Alcohol Value",
        data: [] as number[],
        fill: false,
        tension: 0.3,
        borderColor: "#42A5F5",
        backgroundColor: "#90CAF9",
      },
    ],
  });

  async function load() {
    loading.value = true;

    const sort = sortBy.value[0];
    const sortParam = `${sort?.key}:${sort?.order}`;

    const { data } = await useFetch<DeviceResponse>(
      `/api/v1.0.0/device/${serialNumber}`,
      {
        params: {
          page: page.value,
          limit: itemsPerPage.value,
          sort: sortParam,
          min: filters.value.min,
          max: filters.value.max,
          startDate: filters.value.startDate,
          endDate: filters.value.endDate,
        },
      }
    );

    if (data.value) {
      records.value = data.value.records;
      total.value = data.value.pagination.total;

      // 🎯 Optional: build chartData here too
      chartData.value.labels = records.value.map(r => new Date(r.dateTime))
      chartData.value.datasets[0].data = records.value.map((r) => r.alcoholValue);
    }
    loading.value = false;
  }

  watch(filters,() => {
      page.value = 1;
      load();
    },
    { deep: true }
  );

  return {
    records,
    total,
    loading,
    page,
    itemsPerPage,
    sortBy,
    filters,
    chartData,
    load,
  };
}
