import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import useApi from "@/hooks/useApi";
import { MANAGE_TICKET_TYPES_COLUMNS } from "@/util/TableDataDisplay";
import Table from "../others/Table";
import CreateTicketType from "./CreateTicketType";

const ManageTicketTypes = () => {
    // Fetch all ticket types using SWR (stale-while-revalidate) hook
    const allTicketTypesSWR = useApi(MiscellaneousService.getAllTicketType());
    // State to manage the currently selected ticket type for viewing/editing
    const [viewTicketType, setViewTicketType] = useState(null);
    // Disclosure hook to manage the state of the CreateTicketType modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onTicketTypeClick = (rowProps, _) => {
    setViewTicketType(rowProps.data);
    onOpen();
  };

  const closeModal = () => {
    setViewTicketType(null);
    onClose();
  };

  return (
    <>
        {/* Table to display all ticket types */}

        <Table
        tableData={allTicketTypesSWR.data}
        columns={MANAGE_TICKET_TYPES_COLUMNS}
        onRowClick={onTicketTypeClick}
        height={420}
        searchPlaceholder="Search for ticket type"
      />
      <br />
      <Spacer />
      <Flex justify="flex-end">
        <Button colorScheme="blue" pos="right" onClick={() => onOpen()}>
          Add Ticket Type
        </Button>
      </Flex>

      <CreateTicketType
        isOpen={isOpen}
        onClose={closeModal}
        ticketType={viewTicketType}
        mutateServer={allTicketTypesSWR.mutateServer}
      />
    </>
  );
};

export default ManageTicketTypes;
