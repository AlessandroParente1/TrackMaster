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

  // Collects the fields (keys) within the table data that should be searched.
  // These fields are later used by handleSearchInputChange to filter data based on the user's search input.
  const getDataSourceFields = () => {

    //The fields are defined in the column configuration,
    // specifically in the searchInField property of each column
    const result = [];

    columns.forEach((column) => {

      // If the column has the searchInField property defined,
      // add its values (the fields to search) to the result array.
      // This property is used once during the component mounting
      // to define which fields (dataFields) should be searchable.
      if (column.searchInField) {
        result.push(...column.searchInField);
      }
    });

    // Update the state to store the searchable fields,
    // so they can be accessed later by handleSearchInputChange.
    setDataFields(result);
  };
//Note 2
  //It is called every time the user types in the search bar.
  const handleSearchInputChange = ({ target: { value } }) => {

    const lowerSearchText = value.toLowerCase();

    // Filters tableData data based on the search input

    const newData = tableData.filter((data) => {
      //The dataFields.some function checks whether at least one
      // of the fields defined in dataFields contains the searched text(key)
      return dataFields.some((key) => {
        const value = getFieldValue(data, key);

        //checks if the value obtained includes the searched text.
        return value.toLowerCase().includes(lowerSearchText);
      });
    });
    //updates dataSource with filtered results.
    setDataSource(newData);
  };

  // Runs getDataSourceFields() on mount of the component to populate dataFields with search fields.

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
      {/*responsible for rendering the search input field.*/}
      <SearchBar
        placeholder={searchPlaceholder}
        handleSearchInputChange={handleSearchInputChange}
      />

      <ReactDataGrid
        idProperty="_id"
        style={gridStyle}
        theme="default-dark"

        //data source is the source of data
        //then when dataSource is updated (for example, during a search),
        // the table automatically updates to show only matching results.
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
