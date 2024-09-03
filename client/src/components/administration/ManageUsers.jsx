import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import useApi from "@/hooks/useApi";
import { MANAGE_USERS_COLUMNS } from "@/util/TableDataDisplay";
import Table from "../others/Table";
import UpdateUser from "./UpdateUser";

// Main component to manage users
const ManageUsers = () => {
  // Fetch all users using SWR (stale-while-revalidate) hook, excluding the current user
  const allUsersSWR = useApi(MiscellaneousService.getUsers("excludeUser=true"));

  // State to manage the currently selected user for viewing/editing
  const [viewUser, setViewUser] = useState(null);

  // Disclosure hook to manage the state of the UpdateUser modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to handle clicking on a user in the table
  const onUserClick = (rowProps, _) => {
    setViewUser(rowProps.data); // Set the user data to be viewed/edited
    onOpen(); // Open the UpdateUser modal
  };

  // Function to handle closing the UpdateUser modal
  const closeModal = async () => {
    setViewUser(null); // Reset the selected user
    onClose(); // Close the modal
  };

  return (
    <>
      {/* Table to display all users */}
      <Table
        tableData={allUsersSWR.data} // Data for the table from SWR
        columns={MANAGE_USERS_COLUMNS} // Column configuration for the table
        searchPlaceholder="Search for users" // Placeholder for the search input
        onRowClick={onUserClick} // Handle row click to view/edit user
        height={420} // Height of the table
        isLoading={allUsersSWR.isLoading} // Loading state for the table
      />
      <br />
      <Spacer />
      <Flex justify="flex-end">
        {/* Button to open the UpdateUser modal for adding a new user */}
        <Button colorScheme="blue" pos="right" onClick={() => onOpen()}>
          Add New User
        </Button>
      </Flex>

      {/* UpdateUser modal component for creating or editing users */}
      <UpdateUser
        isOpen={isOpen} // Modal open state
        closeModal={closeModal} // Close modal handler
        viewUser={viewUser} // User data to be edited (or null for creating a new user)
        mutateServer={allUsersSWR.mutateServer} // Function to revalidate SWR data
      />
    </>
  );
};

export default ManageUsers;
