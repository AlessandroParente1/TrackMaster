import Head from "next/head";
import { Flex, Heading, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import Loading from "@/components/others/Loading";
import useApi from "@/hooks/useApi";
import Table from "../components/others/Table";
import CreateTicket from "../components/tickets/CreateTicket";
import TicketService from "../services/ticket-service";
import {MY_TICKETS_COLUMNS,TICKETS_DEFAULT_SORT} from "@/util/TableDataDisplay";

const Tickets = () => {
  //myTicketsSWR uses the useApi hook to retrieve the user's ticket data by making a request to TicketService.getUserTickets()
    const myTicketsSWR = useApi(TicketService.getUserTickets());

    //viewTicket: Tracks the ticket selected for viewing in the modal
  const [viewTicket, setViewTicket] = useState(null);
  //useDisclosure: It is a Chakra UI hook to manage the opening and closing of the modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onTicketClick = (rowProps, _) => {
    //rowProps.data contains the selected ticket data, which is stored in viewTicket
    setViewTicket(rowProps.data);
    //the modal opens up thanks to onOpen()
    onOpen();
  };

  const onModalClose = () => {
    //When the modal closes, viewTicket is reset to null
    setViewTicket(null);
    //onClose() closes the modal
    onClose();
  };

  if (myTicketsSWR.isLoading) {
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

      <Table
        tableData={myTicketsSWR.data}
        columns={MY_TICKETS_COLUMNS}
        defaultSortInfo={TICKETS_DEFAULT_SORT}
        searchPlaceholder="Search tickets by type, title, project, status ..."
        height={450}
        onRowClick={onTicketClick}
        isLoading={myTicketsSWR.isLoading}
      />

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
