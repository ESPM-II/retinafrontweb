import { create } from 'zustand'

const useTableFilters = create((set) => ({
  tableFilters: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      defdefaultPageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
      position: ["bottomLeft"],
      showSizeChanger: true
    },
    sorter: {
      columnKey: 0,
      field: null,
      order: "descend"
    },
    filters: {},
  },
  setTableFilters: (fil) => set(() => ({ tableFilters: fil })),
}))

export default useTableFilters;
