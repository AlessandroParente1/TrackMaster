import {
  Alert,
  AlertIcon,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import ProjectService from "@/services/project-service";
import TicketService from "@/services/ticket-service";
import useApi from "@/hooks/useApi";
import { usePermissions } from "@/hooks/usePermissions";
import { PROJECT_ASSIGNEES_COLUMNS } from "@/util/TableDataDisplay";
import { Permissions } from "@/util/Utils";
import { CreateTicketData } from "@/util/ValidationSchemas";
import AlertModal from "../others/AlertModal";
import PermissionsRender from "../others/PermissionsRender";
import Table from "../others/Table";
import CommentSection from "./CommentSection";
import TicketInfo from "./TicketInfo";

const CreateTicket = ({
  isOpen,
  onClose,
  ticket,
  mutateServer,
  projectInfo,
}) => {
  const isNewTicket = ticket ? false : true;

  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState([]);
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketInfo, setTicketInfo] = useState(CreateTicketData);
  const [error, setError] = useState("");
  const [project, setProject] = useState(projectInfo);

  const projectSWR = useApi(
    ProjectService.getProjectInfo(ticket?.projectId._id),
    !projectInfo && ticket
  );

  const canManageTickets = usePermissions(Permissions.canManageTickets);

  const alertModalDisclosure = useDisclosure();
  const formRef = useRef();

  useEffect(() => {
    //Update the project status whenever data from projectSWR is updated.
    if (projectSWR.data) {
      setProject(projectSWR.data);
    }
  }, [projectSWR]);

  useEffect(() => {
    //It is used to initialize the ticket data in the edit/create form when the modal is opened.
    if (isOpen && ticket) {
      const ticketCopy = { ...ticket };

      ticketCopy._id = ticket._id;
      ticketCopy.projectId = ticket.projectId._id;
      ticketCopy.type = ticket.type._id;
      ticketCopy.assignees = ticket.assignees.map((assignee) => assignee._id);

      setTicketInfo(ticketCopy);
      setSelectedAssigneeIds(ticketCopy.assignees);
      setTicketDescription(ticket.description);
    }
  }, [isOpen]);

  const onTicketAssigneeClick = ({ selected }) => {
    setSelectedAssigneeIds(Object.keys(selected));
  };

  const onTicketDelete = async () => {
    alertModalDisclosure.onClose();

    try {
      const apiRequestInfo = TicketService.deleteTicket(ticket._id);

      await mutateServer(apiRequestInfo);

      closeTicketModal();
    } catch (error) {
      setError(error);
    }
  };

  // Reset modal state and close it

  const closeTicketModal = () => {
    setSelectedAssigneeIds([]);
    setTicketDescription("");
    setTicketInfo(CreateTicketData);
    setError("");
    onClose();
  };

  const onHandleFormSubmit = async (data) => {
    try {
      const ticketData = { ...data };
      ticketData.assignees = selectedAssigneeIds;
      ticketData.description = ticketDescription;

      let apiRequestInfo = {};

      if (isNewTicket) {
        apiRequestInfo = TicketService.createTicket(project._id, ticketData);
      } else {
        apiRequestInfo = TicketService.updateTicket(project._id, ticketData);
      }

      await mutateServer(apiRequestInfo);
      closeTicketModal();
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={closeTicketModal}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as="h3" size="md">
            {!isNewTicket ? "Edit" : "Create"} Ticket
          </Heading>
          <Text fontSize="sm" as="i" fontWeight={400} mt={2}>
            Project: {project?.title}
          </Text>
        </ModalHeader>

        <ModalCloseButton onClick={closeTicketModal} />

        <ModalBody overflowY="auto" mt={-3}>
          <Tabs variant="enclosed" size="sm" colorScheme="blue">
            <TabList>
              <Tab>Ticket Info</Tab>
              {!isNewTicket && <Tab>Comments</Tab>}
              <Tab>Assignees</Tab>
            </TabList>

            {error && (
              <Alert status="error" variant="left-accent" mb={2} fontSize="sm">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <TabPanels>
              <TabPanel>
                <TicketInfo
                  ticketInfo={ticketInfo}
                  onHandleFormSubmit={onHandleFormSubmit}
                  formRef={formRef}
                  error={error}
                  ticketDescription={ticketDescription}
                  setTicketDescription={setTicketDescription}
                />
              </TabPanel>

              {!isNewTicket && (
                <TabPanel>
                  <CommentSection ticketId={ticket ? ticket._id : null} />
                </TabPanel>
              )}

              <TabPanel>
                <Table
                  tableData={project?.assignees}
                  columns={PROJECT_ASSIGNEES_COLUMNS}
                  searchPlaceholder={"Search for users"}
                  height={300}
                  hasCheckboxColumn={true}
                  sortable={false}
                  selectedRowIds={selectedAssigneeIds}
                  onSelectionChange={onTicketAssigneeClick}
                  disableCheckBox={!canManageTickets}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <PermissionsRender permissionCheck={Permissions.canManageTickets}>
          <ModalFooter>
            <Button
              colorScheme="blue"
              type="submit"
              mr={3}
              onClick={() => formRef.current?.handleSubmit()}
            >
              {!isNewTicket ? "Save" : "Create"}
            </Button>
            {!isNewTicket ? (
              <Button
                colorScheme="red"
                onClick={() => alertModalDisclosure.onOpen()}
              >
                Delete
              </Button>
            ) : (
              <Button onClick={closeTicketModal}>Cancel</Button>
            )}
          </ModalFooter>
        </PermissionsRender>
      </ModalContent>

      <AlertModal
        title="Delete ticket"
        body="Are you sure you to delete this ticket?"
        isOpen={alertModalDisclosure.isOpen}
        onClose={alertModalDisclosure.onClose}
        onCTA={onTicketDelete}
      />
    </Modal>
  );
};

export default React.memo(CreateTicket);
