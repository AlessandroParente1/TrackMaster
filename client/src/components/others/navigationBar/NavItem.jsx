import Link from "next/link";
import { Box, Center, Flex, Icon, Text, Tooltip } from "@chakra-ui/react";
import React from "react";

// NavItem component to display a single navigation item in the sidebar
const NavItem = ({ navSize, name, icon, path, active }) => {
  return (
    <Flex
      mt={3} // Margin top for spacing between items
      direction="column" // Align children in a column
      alignItems={navSize === "small" ? "center" : "flex-start"} // Center items if navSize is small, otherwise align to the start
      justifyContent="center" // Center content within the Flex container
      borderRadius={8} // Rounded corners
      w="100%" // Full width of the container
      background={active && "hover"} // Apply background if the item is active
      _hover={{ textDecor: "none", backgroundColor: "hover" }} // Hover effect with no text decoration and background color change
    >
      {/* Tooltip for when the navSize is small and name is hidden */}
      <Tooltip label={navSize === "small" && name}>
        <Link href={path} w="100%">
          {/* Box to contain the icon and text */}
          <Box px={2} py={3} borderRadius={8} align="center">
            <Center>
              <Flex alignItems="center">
                {/* Icon representing the nav item */}
                <Icon as={icon} fontSize="xl" color="gray.400" />
                {/* Text label for the nav item, hidden when navSize is small */}
                <Text
                  ml={3} // Margin left for spacing between icon and text
                  fontSize="sm" // Small font size for the label
                  display={navSize === "small" ? "none" : "flex"} // Hide text when navSize is small
                >
                  {name}
                </Text>
              </Flex>
            </Center>
          </Box>
        </Link>
      </Tooltip>
    </Flex>
  );
};

export default NavItem;
