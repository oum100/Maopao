import { ref } from "vue";
// import { useFetch } from "#app";


export function useDeviceTable() {
  const items = ref<any[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const page = ref(1);
  const itemsPerPage = ref(10);

  // ✅ Vuetify 3 compatible sort-by
  type SortOrder = "asc" | "desc";
  type SortItem = { key: string; order?: SortOrder };

  const sortBy = ref<SortItem[]>([{ key: "createdAt", order: "desc" }]);

  const filters = ref({
    model: "",
    version: "",
    unitId: "",
    testModeId: ""
  });

  async function load() {
    loading.value = true;

    const sort = sortBy.value[0];
    const sortParam = `${sort?.key || "createdAt"}:${sort?.order || "desc"}`;

    interface DeviceResponse {
      data: any[];
      pagination: { total: number };
    }

    try{
      const  data  = await $fetch("/api/v1.0.0/device", {
        params: {
          page: page.value,
          limit: itemsPerPage.value,
          // sort: sortBy.value[0]?.key || 'createdAt',
          sort: sortParam,
          order: sortBy.value[0]?.order || 'desc',
          model: filters.value.model,
          version: filters.value.version,
          unitId: filters.value.unitId,
          testModeId: filters.value.testModeId,
        },
      });

      if (data) {
        items.value = data.data;
        total.value = data.pagination.total;
      }
      loading.value = false;
    }catch{
      loading.value = false;
    }
  }

  function exportToCSV() {
    if (!items.value.length) return;

    const headers = Object.keys(items.value[0]);
    const rows = items.value.map((item) =>
      headers.map((h) => JSON.stringify(item[h] ?? "")).join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `devices_page${page.value}.csv`;
    link.click();
  }

  return {
    items,
    total,
    loading,
    page,
    itemsPerPage,
    sortBy,
    filters,
    load,
    exportToCSV,
  };
}
