import Image from "next/image";
import { useRouter } from "next/router";
import {  Avatar,  Divider,  Flex,  Heading,  Menu,  MenuButton,  MenuItem,  MenuList,  Text,  useDisclosure} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiFileText, FiLayers, FiUser } from "react-icons/fi";
import useApi from "@/hooks/useApi";
import useAuthStore from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Permissions, getUserFullname } from "@/util/Utils";
import logo from "@/assets/TrackMaster_Plain.png";
import UpdateUser from "../../administration/UpdateUser";
import NavItem from "./NavItem";

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

  useEffect(() => {
    if (myUserProfileSWR.data) {
      useAuth.setUserProfile(myUserProfileSWR.data);
    }
  }, [myUserProfileSWR.data]);

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

  const onProfileClick = () => {
    onOpen();
  };

  const onLogout = () => {
    //useAuth.clear();
    router.reload();
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
          <Image src={logo} alt="track it logo" />

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
              <MenuItem onClick={onProfileClick}>Profile</MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

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
