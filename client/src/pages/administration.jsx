import Head from "next/head";
import {
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import ManageRoles from "@/components/administration/ManageRoles";
import ManageTicketTypes from "@/components/administration/ManageTicketTypes";
import ManageUsers from "@/components/administration/ManageUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { Permissions } from "@/util/Utils";
import PageNotFound from "./404";

// Administration component to manage users, roles, and ticket types
const Administration = () => {
  const canManageAdminPage = usePermissions(Permissions.canManageAdminPage); // Permission check to manage admin page

  if (!canManageAdminPage) {
    return <PageNotFound />; // Redirect to 404 if user doesn't have permission
  }

  return (
      <Flex w="100%" direction="column" p={10}>
        <Head>
          <title>Administration</title>
        </Head>
        <Flex w="100%" h="fit-content">
          <Heading as="h1" size="lg" fontWeight={600}>
            Administration
          </Heading>
        </Flex>
        <br />

        <Tabs variant="enclosed" size="sm" colorScheme="blue">
          <TabList>
            <Tab>Manage Users</Tab>
            <Tab>Manage Roles</Tab>
            <Tab>Manage Ticket Type</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ManageUsers />
            </TabPanel>

            <TabPanel>
              <ManageRoles />
            </TabPanel>

            <TabPanel>
              <ManageTicketTypes />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
  );
};

export default Administration;
