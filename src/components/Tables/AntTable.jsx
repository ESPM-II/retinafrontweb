import React, { useEffect } from "react";
import { Table } from "antd";
import useTableFilters from "../../common/store/tableFiltersStore";
import { v4 } from "uuid";

const makeColumns = (columns) => {
  const modifiedColumns = columns.map((col, i) => ({
    ...col,
    responsive: ["xs", "md"],
    key: i,
    align: "center",
    ellipsis: true,
    sorter: col.dataIndex ? true : false,
    sortDirections: ["ascend", "descend"],
  }));

  return modifiedColumns;
};

const AntTable = ({
  columns = [],
  data = [],
  setRowSelection = false,
  expandable = false,
  expandedRowRender = <></>,
  loading = false,
  hasPagination = true,
}) => {
  const { tableFilters, setTableFilters } = useTableFilters();

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilters({
      pagination,
      filters,
      sorter: Object.keys(sorter).length > 0 ? sorter : tableFilters.sorter,
    });
  };

  useEffect(() => {}, [tableFilters]);

  return (
    <Table
      className="flex w-full h-full"
      columns={makeColumns(columns, tableFilters)}
      rowKey={() => v4()}
      rowSelection={
        setRowSelection && {
          onChange: (_, selectedRows) => {
            setRowSelection(selectedRows);
          },
        }
      }
      rowClassName="text-xs"
      expandable={
        expandable
          ? {
              expandedRowRender,
              defaultExpandedRowKeys: ["0"],
            }
          : false
      }
      dataSource={data}
      pagination={hasPagination && tableFilters.pagination}
      size="small"
      loading={loading}
      bordered
      onChange={handleTableChange}
    />
  );
};

export default AntTable;
