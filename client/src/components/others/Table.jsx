import ReactDataGrid from "@inovua/reactdatagrid-community";
import { useEffect, useState } from "react";
import React from "react";
import { getFieldValue } from "@/util/GetObjectProperty";
import SearchBar from "./SearchBar";

// Table component to render data in a grid format with search and selection capabilities
const Table = ({
                 tableData = [], // The data to be displayed in the table
                 columns, // Configuration for the columns
                 searchPlaceholder, // Placeholder text for the search bar
                 onRowClick, // Function to handle row click events
                 defaultSortInfo, // Default sorting information for the table
                 hasCheckboxColumn = false, // Flag to determine if checkbox column should be shown
                 sortable = true, // Flag to enable/disable column sorting
                 selectedRowIds, // Array of selected row IDs
                 onSelectionChange, // Function to handle changes in row selection
                 height = 400, // Height of the table
                 rowHeight = 45, // Height of each row in the table
                 disableCheckBox = false, // Flag to disable checkbox selection
                 isLoading = false, // Flag to show loading state in the table
               }) => {
  // State to manage the data displayed in the table
  const [dataSource, setDataSource] = useState([]);

  // State to manage selected rows in the table
  const [selectedRow, setSelectedRow] = useState({});

  // State to manage searchable fields in the data
  const [dataFields, setDataFields] = useState([]);

  // Style for the table grid
  const gridStyle = { minHeight: height };

  // Function to extract the searchable fields from the column configuration
  const getDataSourceFields = () => {
    const result = [];

    columns.forEach((column) => {
      if (column.searchInField) {
        result.push(...column.searchInField);
      }
    });

    setDataFields(result);
  };

  // Function to handle changes in the search input
  const handleSearchInputChange = ({ target: { value } }) => {
    const lowerSearchText = value.toLowerCase();

    // Filter data based on the search input
    const newData = tableData.filter((data) => {
      return dataFields.some((key) => {
        const value = getFieldValue(data, key);
        return value.toLowerCase().includes(lowerSearchText);
      });
    });

    setDataSource(newData);
  };

  // useEffect to initialize searchable fields when component mounts
  useEffect(() => {
    getDataSourceFields();
  }, []);

  // useEffect to update the data source when the table data changes
  useEffect(() => {
    if (tableData) {
      setDataSource(tableData);
    }
  }, [tableData]);

  // useEffect to manage selected rows when selectedRowIds prop changes
  useEffect(() => {
    if (selectedRowIds) {
      const selectedRowData = {};

      selectedRowIds.forEach((id) => (selectedRowData[id] = true));

      setSelectedRow(selectedRowData);
    }
  }, [selectedRowIds]);

  return (
      <>
        {/* Search bar component to filter the data in the table */}
        <SearchBar
            placeholder={searchPlaceholder}
            handleSearchInputChange={handleSearchInputChange}
        />

        {/* ReactDataGrid component to display the data grid */}
        <ReactDataGrid
            idProperty="_id" // Unique identifier for each row
            style={gridStyle} // Apply grid style
            theme="default-dark" // Set theme for the grid
            dataSource={dataSource} // Data to be displayed in the table
            columns={columns} // Column configuration
            defaultSortInfo={defaultSortInfo} // Default sorting information
            sortable={sortable} // Enable or disable sorting
            onRowClick={onRowClick} // Handle row click events
            checkboxColumn={!disableCheckBox && hasCheckboxColumn} // Show or hide checkbox column
            checkboxOnlyRowSelect={hasCheckboxColumn} // Enable row selection only through checkbox
            selected={selectedRow} // Currently selected rows
            onSelectionChange={onSelectionChange} // Handle changes in selection
            showColumnMenuTool={false} // Hide column menu tool
            loading={isLoading} // Show loading spinner when data is loading
            rowHeight={rowHeight} // Set height for each row
            showCellBorders="horizontal" // Show horizontal borders between cells
        />
      </>
  );
};

export default Table;
