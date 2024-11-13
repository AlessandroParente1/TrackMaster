import Head from "next/head";
import { useRouter } from "next/router";
import PageNotFound from "@/pages/404";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {  Button,  Flex,  Heading,  IconButton,  Spacer,  Tab,  TabList,  TabPanel,  TabPanels,  Tabs,  useDisclosure} from "@chakra-ui/react";
import React, { useState } from "react";
import PermissionsRender from "@/components/others/PermissionsRender";
import Table from "@/components/others/Table";
import Dashboard from "@/components/projects/Dashboard";
import ProjectService from "@/services/project-service";
import TicketService from "@/services/ticket-service";
import useApi from "@/hooks/useApi";
import { TICKETS_COLUMNS, TICKETS_DEFAULT_SORT } from "@/util/TableDataDisplay";
import { Permissions } from "@/util/Utils";
import Loading from "../others/Loading";
import CreateTicket from "../tickets/CreateTicket";
import AddProject from "./AddProject";

//displays information about a specific project (projectId) and its associated tickets.

const ViewProject = ({ projectId }) => {
  //useDisclosure is used to manage the open and closed status of the modals for ticket details (isOpen, onOpen, onClose)
  // and project information (projectInfoDisclosure).
  const { isOpen, onOpen, onClose } = useDisclosure();
  const projectInfoDiscloure = useDisclosure();

  //useRouter is used for navigation between pages. navigateBack allows you to return to the list of projects (/projects
  const router = useRouter();

  //These call useApi to retrieve project ticket data (getProjectTickets) and project information (getProjectInfo), using projectId for the API request.
  const projectTicketsSWR = useApi(TicketService.getProjectTickets(projectId));
  const projectInfoSWR = useApi(ProjectService.getProjectInfo(projectId));

  //SWR (stale-while-revalidate) enables data storage and retrieval with automatic updates.

  //viewTicket represents the selected ticket. When the user clicks on a ticket, setViewTicket updates the status with the ticket details, and onOpen opens the modal
  const [viewTicket, setViewTicket] = useState(null);

  //Resets viewTicket to null and closes the modal, deleting the ticket details.
  const onModalClose = () => {
    setViewTicket(null);
    onClose();
  };

  //Executed when the user clicks on a ticket. Sets viewTicket with the ticket data and opens the modal.
  const onTicketClick = (rowProps, _) => {
    setViewTicket(rowProps.data);
    onOpen();
  };

  //Redirects the user to the /projects page, useful for returning to the list of projects.
  const navigateBack = () => {
    router.replace("/projects");
  };

  //If there is an error loading (projectInfoSWR.error?.response.status), it renders a PageNotFound component, indicating that the project was not found.
  if (projectInfoSWR.error?.response.status) {
    return <PageNotFound />;
  }

  //If projectInfoSWR.isLoading or projectTicketsSWR.isLoading is true, a Loading component appears to indicate that data is being loaded.
  if (projectInfoSWR.isLoading || projectTicketsSWR.isLoading) {
    return <Loading />;
  }

  return (
    <Flex w="100%" direction="column" px={8} py={6}>
      <Head>
        <title>{projectInfoSWR.data?.title || "Projects"}</title>
      </Head>
      <Flex w="100%" h="fit-content">
        <Heading as="h1" size="md" fontWeight={600}>
          <IconButton
            icon={<ArrowBackIcon />}
            variant="link"
            size="lg"
            colorScheme="black"
            onClick={navigateBack}
          />
          {projectInfoSWR.data?.title}
        </Heading>

        <Spacer />

        <PermissionsRender permissionCheck={Permissions.canManageTickets}>
          <Button colorScheme="blue" size="md" mr={5} onClick={() => onOpen()}>
            Add Ticket
          </Button>
        </PermissionsRender>

        <Button
          colorScheme="teal"
          onClick={() => projectInfoDiscloure.onOpen()}
        >
          Project Info
        </Button>
      </Flex>

      <Tabs variant="enclosed" size="sm" colorScheme="blue" mt={2} h="100%">
        <TabList>
          <Tab>Tickets</Tab>
          <Tab>Overview</Tab>
        </TabList>

        <TabPanels h="100%">
          <TabPanel h="100%">
            <Table
              tableData={projectTicketsSWR.data}
              columns={TICKETS_COLUMNS}
              searchPlaceholder="Search tickets by type, title, status ..."
              onRowClick={onTicketClick}
              defaultSortInfo={TICKETS_DEFAULT_SORT}
              height="92%"
            />
          </TabPanel>
          <TabPanel>
            {projectId ? <Dashboard projectId={projectId} /> : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <br />

      {projectInfoSWR.data ? (
        <CreateTicket
          isOpen={isOpen}
          onClose={onModalClose}
          ticket={viewTicket}
          projectInfo={projectInfoSWR.data}
          mutateServer={projectTicketsSWR.mutateServer}
        />
      ) : null}

      <AddProject
        isOpen={projectInfoDiscloure.isOpen}
        onClose={projectInfoDiscloure.onClose}
        projectInfo={projectInfoSWR.data}
        mutateServer={projectInfoSWR.mutateServer}
      />
    </Flex>
  );
};

export default ViewProject;
