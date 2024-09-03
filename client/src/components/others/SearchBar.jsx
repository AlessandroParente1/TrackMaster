import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";

// SearchBar component for handling search input
const SearchBar = ({ placeholder, handleSearchInputChange }) => {
  return (
    <Flex
      direction="column"
      gap={3}
      w="100%"
      alignItems="space-between"
      justifyContent="space-between"
      mb={5}
    >
      {/* Input group containing the search input and icon */}
      <InputGroup mr={5}>
        {/* Icon displayed inside the input field */}
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.500" />
        </InputLeftElement>

        {/* Search input field */}
        <Input
          variant="filled" // Filled style for the input field
          placeholder={placeholder} // Placeholder text
          onChange={handleSearchInputChange} // Event handler for input change
        />
      </InputGroup>
    </Flex>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(SearchBar);
