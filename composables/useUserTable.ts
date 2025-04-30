


interface UserTableResponse<T> {
    data: T[]
    pagination: {
        page:number,
        limit: number,
        total: number,
        totalPages:number
    }
}

export const useUserTable = <T>() => {
    const page = ref(1)
    const pageSize = ref(10)
    const nameFilter = ref('')

    type SortOrder = 'asc' | 'desc'
    type SortItem = { key: string; order?: SortOrder }
    const sortBy = ref<SortItem[]>([{ key: 'createdAt', order: 'desc' }])

    const { data, pending, refresh } = useFetch<UserTableResponse<T>>(`/api/v1.0.0/user`, {
        query: () => ({
        page: page.value,
        pageSize: pageSize.value,
        name: nameFilter.value,
        sort: sortBy.value[0]?.key || 'createdAt',
        order: sortBy.value[0]?.order || 'desc',
        }),
    })

    const total = computed(() => data.value?.pagination.total || 0)
    const rows = computed(() => data.value?.data || [])

    const exportExcel = () => {
        window.open(`/api/v1.0.0/user/export`, '_blank')
    }

    const deleteItem = async (code: number) => {
        await $fetch(`/api/v1.0.0/user/${code}`, { method: 'DELETE' })
        await refresh()
    }

    return {
        page,
        pageSize,
        nameFilter,
        rows,
        total,
        pending,
        sortBy,
        refresh,
        exportExcel,
        deleteItem,
    }
}