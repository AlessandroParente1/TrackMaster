import Head from "next/head";
import { Flex, Heading, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import Loading from "@/components/others/Loading";
import useApi from "@/hooks/useApi";
import Table from "../components/others/Table";
import CreateTicket from "../components/tickets/CreateTicket";
import TicketService from "../services/ticket-service";
import {
  MY_TICKETS_COLUMNS,
  TICKETS_DEFAULT_SORT,
} from "../util/TableDataDisplay";

const Tickets = () => {
  const myTicketsSWR = useApi(TicketService.getUserTickets()); // Fetch user tickets

  const [viewTicket, setViewTicket] = useState(null); // State to manage the selected ticket
  const { isOpen, onOpen, onClose } = useDisclosure(); // Manage the open/close state of the ticket modal

  // Handle ticket row click to open the modal with the selected ticket
  const onTicketClick = (rowProps, _) => {
    setViewTicket(rowProps.data);
    onOpen();
  };

  // Close the modal and reset the selected ticket
  const onModalClose = () => {
    setViewTicket(null);
    onClose();
  };

  if (myTicketsSWR.isLoading) {
    // Display loading spinner while data is being fetched
    return <Loading />;
  }

  return (
    <Flex w="100%" direction="column" padding={10}>
      <Head>
        <title>Tickets</title>
      </Head>
      <Flex w="100%" h="fit-content">
        <Heading as="h1" size="lg" fontWeight={600}>
          My Tickets
        </Heading>
      </Flex>

      <br />

      {/* Render the tickets table */}
      <Table
        tableData={myTicketsSWR.data}
        columns={MY_TICKETS_COLUMNS}
        defaultSortInfo={TICKETS_DEFAULT_SORT}
        searchPlaceholder="Search tickets by type, title, project, status ..."
        height={450}
        onRowClick={onTicketClick}
        isLoading={myTicketsSWR.isLoading}
      />

      {/* Modal for viewing or creating a ticket */}
      <CreateTicket
        isOpen={isOpen}
        onClose={onModalClose}
        ticket={viewTicket}
        mutateServer={myTicketsSWR.mutateServer}
      />
    </Flex>
  );
};

export default Tickets;
