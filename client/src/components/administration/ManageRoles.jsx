import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import useApi from "@/hooks/useApi";
import { MANAGE_ROLES } from "@/util/TableDataDisplay";
import Table from "../others/Table";
import CreateRole from "./CreateRole";

// Main component to manage roles
const ManageRoles = () => {
    // Fetch all roles using SWR (stale-while-revalidate) hook
    const allRolesSWR = useApi(MiscellaneousService.getRoles());

    // State to manage the currently selected role for viewing/editing
    const [viewRole, setViewRole] = useState(null);

    // Disclosure hook to manage the state of the CreateRole modal
    const { isOpen, onClose, onOpen } = useDisclosure();

    // Function to handle clicking on a role in the table
    const onRoleClick = (rowProps, _) => {
        setViewRole(rowProps.data); // Set the role data to be viewed/edited
        onOpen(); // Open the CreateRole modal
    };

    // Function to handle closing the CreateRole modal
    const closeModal = () => {
        setViewRole(null); // Reset the selected role
        onClose(); // Close the modal
    };

    return (
        <>
            {/* Table to display all roles */}
            <Table
                tableData={allRolesSWR.data} // Data for the table from SWR
                columns={MANAGE_ROLES} // Column configuration for the table
                rowHeight={null}
                onRowClick={onRoleClick} // Handle row click to view/edit role
                height={420} // Height of the table
                searchPlaceholder="Search for role" // Placeholder for the search input
            />
            <br />
            <Spacer />
            <Flex justify="flex-end">
                {/* Button to open the CreateRole modal for adding a new role */}
                <Button colorScheme="blue" pos="right" onClick={() => onOpen()}>
                    Add Role
                </Button>
            </Flex>

            {/* CreateRole modal component for creating or editing roles */}
            <CreateRole
                isOpen={isOpen} // Modal open state
                onClose={closeModal} // Close modal handler
                role={viewRole} // Role data to be edited (or null for creating a new role)
                mutateServer={allRolesSWR.mutateServer} // Function to revalidate SWR data
            />
        </>
    );
};

export default ManageRoles;
