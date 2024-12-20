import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Flex, Heading, Spacer, useDisclosure } from "@chakra-ui/react";
import PermissionsRender from "@/components/others/PermissionsRender";
import Table from "@/components/others/Table";
import AddProject from "@/components/projects/AddProject";
import ProjectService from "@/services/project-service";
import useApi from "@/hooks/useApi";
import { PROJECTS_COLUMNS } from "@/util/TableDataDisplay";
import { Permissions } from "@/util/Utils";

const ViewAllProjects = () => {
  //A Next.js hook to access routing parameters and navigate between pages.
  const router = useRouter();

  //A Chakra UI hook to manage the opening and closing of modals or panels.
  const { isOpen, onOpen, onClose } = useDisclosure();

  //Custom hook to make API requests and handle response status.
  const projectsSWR = useApi(ProjectService.getMyProjects());

  //This function is executed when a table row is clicked.  and
  const handleRowClick = (rowData) => {

    //Takes the project ID from the row (rowData.data._id)
    const projectId = rowData.data._id;

    //uses router.push to navigate to that specific project's page
    router.push(`/projects/${projectId}`);
  };

  return (
    <Flex w="100%" maxHeight="100vh" direction="column" padding={10}>
      <Head>
        <title>Projects</title>
      </Head>
      <Flex w="100%" h="fit-content">
        <Heading as="h1" size="lg" fontWeight={600}>
          Projects
        </Heading>
        <Spacer />
          {/*The "Add Project" button is only shown if the user has permission to manage projects,
          thanks to the PermissionsRender component that checks permissions through Permissions.canManageProjects.
          The backend request is done in AddProject in HandleFormSubmit*/}
        <PermissionsRender permissionCheck={Permissions.canManageProjects}>
          <Button
            colorScheme="blue"
            variant="solid"
            fontWeight={500}
            onClick={onOpen}
          >
            Add Project
          </Button>
        </PermissionsRender>
      </Flex>

      <br />

      <Table
        tableData={projectsSWR.data}
        columns={PROJECTS_COLUMNS}
        searchPlaceholder="Search for projects"
        onRowClick={handleRowClick}
        isLoading={projectsSWR.isLoading}
      />

        {/*The component opens only when the button is clicked (the one above),
        thanks to state management via the Chakra UI useDisclosure hook*/}
      <AddProject
        isOpen={isOpen}
        onClose={onClose}
        mutateServer={projectsSWR.mutateServer}
      />
    </Flex>
  );
};

export default ViewAllProjects;
