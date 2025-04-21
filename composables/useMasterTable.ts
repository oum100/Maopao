// composables/useMasterTable.ts

interface MasterTableResponse<T> {
    data: T[]
    pagination: {
        page:number,
        limit: number,
        total: number,
        totalPages:number
    }
  }
  
export const useMasterTable = <T>(resource: 'language' | 'unit' | 'testMode') => {
    const page = ref(1)
    const pageSize = ref(10)
    const nameFilter = ref('')

    const { data, pending, refresh } = useFetch<MasterTableResponse<T>>(`/api/v1.0.0/${resource}`, {
        query: () => ({
        page: page.value,
        pageSize: pageSize.value,
        name: nameFilter.value,
        }),
    })

    const total = computed(() => data.value?.pagination.total || 0)
    const rows = computed(() => data.value?.data || [])

    const exportExcel = () => {
        window.open(`/api/v1.0.0/${resource}/export`, '_blank')
    }

    const deleteItem = async (code: number) => {
        await $fetch(`/api/v1.0.0/${resource}/${code}`, { method: 'DELETE' })
        await refresh()
    }

    return {
        page,
        pageSize,
        nameFilter,
        rows,
        total,
        pending,
        refresh,
        exportExcel,
        deleteItem,
    }
}
  