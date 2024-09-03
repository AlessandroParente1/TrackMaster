import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import useApi from "@/hooks/useApi";
import { MANAGE_TICKET_TYPES_COLUMNS } from "../../util/TableDataDisplay";
import Table from "../others/Table";
import CreateTicketType from "./CreateTicketType";

// Main component to manage ticket types
const ManageTicketTypes = () => {
    // Fetch all ticket types using SWR (stale-while-revalidate) hook
    const allTicketTypesSWR = useApi(MiscellaneousService.getAllTicketType());

    // State to manage the currently selected ticket type for viewing/editing
    const [viewTicketType, setViewTicketType] = useState(null);

    // Disclosure hook to manage the state of the CreateTicketType modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Function to handle clicking on a ticket type in the table
    const onTicketTypeClick = (rowProps, _) => {
        setViewTicketType(rowProps.data); // Set the ticket type data to be viewed/edited
        onOpen(); // Open the CreateTicketType modal
    };

    // Function to handle closing the CreateTicketType modal
    const closeModal = () => {
        setViewTicketType(null); // Reset the selected ticket type
        onClose(); // Close the modal
    };

    return (
        <>
            {/* Table to display all ticket types */}
            <Table
                tableData={allTicketTypesSWR.data} // Data for the table from SWR
                columns={MANAGE_TICKET_TYPES_COLUMNS} // Column configuration for the table
                onRowClick={onTicketTypeClick} // Handle row click to view/edit ticket type
                height={420} // Height of the table
                searchPlaceholder="Search for ticket type" // Placeholder for the search input
            />
            <br />
            <Spacer />
            <Flex justify="flex-end">
                {/* Button to open the CreateTicketType modal for adding a new ticket type */}
                <Button colorScheme="blue" pos="right" onClick={() => onOpen()}>
                    Add Ticket Type
                </Button>
            </Flex>

            {/* CreateTicketType modal component for creating or editing ticket types */}
            <CreateTicketType
                isOpen={isOpen} // Modal open state
                onClose={closeModal} // Close modal handler
                ticketType={viewTicketType} // Ticket type data to be edited (or null for creating a new ticket type)
                mutateServer={allTicketTypesSWR.mutateServer} // Function to revalidate SWR data
            />
        </>
    );
};

export default ManageTicketTypes;
