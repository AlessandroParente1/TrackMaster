import ReactDataGrid from "@inovua/reactdatagrid-community";
import { useEffect, useState } from "react";
import React from "react";
import { getFieldValue } from "@/util/GetObjectProperty";
import SearchBar from "./SearchBar";

//Table displays a table with search, selection and column customization capabilities
const Table = ({
  tableData = [],
  columns,
  searchPlaceholder,
  onRowClick,
  defaultSortInfo,
  hasCheckboxColumn = false,
  sortable = true,
  selectedRowIds,
  onSelectionChange,
  height = 400,
  rowHeight = 45,
  disableCheckBox = false,
  isLoading = false,
}) => {
  // represents the data currently visible. It is initialized as an empty array and populated with tableData or the result of a search.
  const [dataSource, setDataSource] = useState([]);
  // object that keeps track of the selected rows (the row IDs are the keys).
  const [selectedRow, setSelectedRow] = useState({});
  // array of fields on which the search can be applied.
  const [dataFields, setDataFields] = useState([]);
  // Style for the table grid
  const gridStyle = { minHeight: height };

  const getDataSourceFields = () => {
    const result = [];

    columns.forEach((column) => {
      if (column.searchInField) {
        result.push(...column.searchInField);
      }
    });

    setDataFields(result);
  };

  const handleSearchInputChange = ({ target: { value } }) => {

    const lowerSearchText = value.toLowerCase();

    // Filter data based on the search input

    const newData = tableData.filter((data) => {
      return dataFields.some((key) => {
        const value = getFieldValue(data, key);
        return value.toLowerCase().includes(lowerSearchText);
      });
    });
    //updates dataSource with filtered results.
    setDataSource(newData);
  };

  // Runs getDataSourceFields() on mount to populate dataFields with lookup fields.

  useEffect(() => {
    getDataSourceFields();
  }, []);

  // Whenever tableData changes, it updates the dataSource with the new data, ensuring that the table always displays the current data.

  useEffect(() => {
    if (tableData) {
      setDataSource(tableData);
    }
  }, [tableData]);

  useEffect(() => {
    if (selectedRowIds) {
      const selectedRowData = {};

      //Transforms selectedRowIds into an object (selectedRowData) where each selected ID is mapped to true, synchronizing the selected rows of the table.
      selectedRowIds.forEach((id) => (selectedRowData[id] = true));

      setSelectedRow(selectedRowData);
    }
  }, [selectedRowIds]);// gets activated every time selectedRowIds changes

  return (
    <>
      <SearchBar
        placeholder={searchPlaceholder}
        handleSearchInputChange={handleSearchInputChange}
      />

      <ReactDataGrid
        idProperty="_id"
        style={gridStyle}
        theme="default-dark"
        dataSource={dataSource}
        columns={columns}
        defaultSortInfo={defaultSortInfo}
        sortable={sortable}
        onRowClick={onRowClick}
        checkboxColumn={!disableCheckBox && hasCheckboxColumn} // Show or hide checkbox column
        checkboxOnlyRowSelect={hasCheckboxColumn}
        selected={selectedRow}
        onSelectionChange={onSelectionChange}
        showColumnMenuTool={false} // Hide column menu tool
        loading={isLoading}
        rowHeight={rowHeight}
        showCellBorders="horizontal"
      />
    </>
  );
};

export default Table;
