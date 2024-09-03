import Image from "next/image";
import { useRouter } from "next/router";
import {
  Avatar, Divider, Flex, Heading, Menu, MenuButton, MenuItem, MenuList,
  Text, useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiFileText, FiLayers, FiUser } from "react-icons/fi";
import useApi from "@/hooks/useApi";
import useAuthStore from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Permissions, getUserFullname } from "@/util/Utils";
import logo from "@/assets/TrackMaster_Plain.png";
import UpdateUser from "../../administration/UpdateUser";
import NavItem from "./NavItem";

// Navbar component to display the navigation sidebar
const Navbar = () => {
  // State to manage the size of the navigation (small or large)
  const [navSize] = useState("large");

  // Router hook for navigation and route-related utilities
  const router = useRouter();

  // Chakra UI hook to manage the state of the UpdateUser modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Permission check to determine if the user can manage the admin page
  const canManageAdminPage = usePermissions(Permissions.canManageAdminPage);

  // Authentication store hook to manage user data and auth-related actions
  const useAuth = useAuthStore();

  // SWR hook to manage data fetching and caching for the user's profile
  const myUserProfileSWR = useApi(null);

  // Effect to update the user profile in the auth store when the profile data is fetched
  useEffect(() => {
    if (myUserProfileSWR.data) {
      useAuth.setUserProfile(myUserProfileSWR.data);
    }
  }, [myUserProfileSWR.data]);

  // Array defining the navigation menu items
  const menuItems = [
    {
      path: "/projects",
      name: "Projects",
      icon: FiLayers,
    },
    {
      path: "/tickets",
      name: "Tickets",
      icon: FiFileText,
    },
    {
      path: "/administration",
      name: "Administration",
      icon: FiUser,
    },
  ];

  // Function to handle profile click and open the profile modal
  const onProfileClick = () => {
    onOpen();
  };

  // Function to handle user logout
  const onLogout = () => {
    useAuth.clear(); // Clear user data from the auth store
    router.reload(); // Reload the page to reflect the logged-out state
  };

  return (
    <>
      <Flex
        pos="sticky"
        h="100vh"
        direction="column"
        justifyContent="space-between"
        w={navSize === "small" ? "75px" : "250px"}
        boxShadow="xl"
      >
        <Flex
          p={5}
          direction="column"
          alignItems={navSize === "small" ? "center" : "flex-start"}
          as="nav"
        >
          {/* Company logo */}
          <Image src={logo} alt="Track Master logo" />

          {/* Navigation items */}
          {menuItems.map((item, index) => {
            // Conditionally render the Administration item based on permissions
            if (item.name === "Administration" && !canManageAdminPage) {
              return <React.Fragment key={index}></React.Fragment>;
            }

            return (
              <NavItem
                key={index}
                navSize={navSize}
                icon={item.icon}
                name={item.name}
                path={item.path}
                active={
                  router.pathname.includes(item.path) ||
                  (item.path === "/projects" && router.pathname === "/")
                }
              />
            );
          })}
        </Flex>

        <Flex p={5} direction="column" w="100%" alignItems="flex-start" mb={4}>
          <Divider
            borderColor="gray.300"
            display={navSize === "small" ? "none" : "flex"}
          />

          {/* User profile and menu */}
          <Menu matchWidth={true}>
            <MenuButton>
              <Flex mt={4} align="center" cursor="pointer">
                <Avatar size="sm" name={getUserFullname(useAuth.userProfile)} />
                <Flex direction="column" ml={4} align="left">
                  <Heading as="h3" size="xs">
                    {useAuth.userProfile.firstName}{" "}
                    {useAuth.userProfile.lastName}
                  </Heading>
                  <Text fontSize="sm">
                    {useAuth.userProfile.roleId.name || "No Data"}
                  </Text>
                </Flex>
              </Flex>
            </MenuButton>
            <MenuList>
              {/* Profile and Logout menu items */}
              <MenuItem onClick={onProfileClick}>Profile</MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* UpdateUser modal for updating the user's profile */}
      <UpdateUser
        isOpen={isOpen}
        closeModal={onClose}
        viewUser={useAuth.userProfile}
        isUpdateMyProfile={true}
        mutateServer={myUserProfileSWR.mutateServer}
      />
    </>
  );
};

export default Navbar;
