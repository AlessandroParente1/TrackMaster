import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import useApi from "@/hooks/useApi";
import { MANAGE_USERS_COLUMNS } from "@/util/TableDataDisplay";
import Table from "../others/Table";
import UpdateUser from "./UpdateUser";

const ManageUsers = () => {
    // Fetch all users using SWR (stale-while-revalidate) hook, excluding the current user
    const allUsersSWR = useApi(MiscellaneousService.getUsers("excludeUser=true"));
    // State to manage the currently selected user for viewing/editing
    const [viewUser, setViewUser] = useState(null);
    // Disclosure hook to manage the state of the UpdateUser modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onUserClick = (rowProps, _) => {
    setViewUser(rowProps.data);
    onOpen();
  };

  const closeModal = async () => {
    setViewUser(null);
    onClose();
  };

  return (
    <>
        {/* Table to display all users */}

        <Table
        tableData={allUsersSWR.data}
        columns={MANAGE_USERS_COLUMNS}
        searchPlaceholder="Search for users"
        onRowClick={onUserClick}
        height={420}
        isLoading={allUsersSWR.isLoading}
      />
      <br />
      <Spacer />
      <Flex justify="flex-end">
        <Button colorScheme="blue" pos="right" onClick={() => onOpen()}>
          Add New User
        </Button>
      </Flex>
        {/* UpdateUser modal component for creating or editing users */}

        <UpdateUser
        isOpen={isOpen}
        closeModal={closeModal}
        viewUser={viewUser}
        mutateServer={allUsersSWR.mutateServer}
      />
    </>
  );
};

export default ManageUsers;
