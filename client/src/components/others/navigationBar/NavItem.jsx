import Link from "next/link";
import { Box, Center, Flex, Icon, Text, Tooltip } from "@chakra-ui/react";
import React from "react";

// NavItem component to display a single navigation item in the sidebar

const NavItem = ({ navSize, name, icon, path, active }) => {
  return (
    <Flex
       mt={3} // Margin top for spacing between items
      direction="column"
       alignItems={navSize === "small" ? "center" : "flex-start"} // Center items if navSize is small, otherwise align to the start
      justifyContent="center"
      borderRadius={8}
      w="100%"
      background={active && "hover"}
       _hover={{ textDecor: "none", backgroundColor: "hover" }} // Hover effect with no text decoration and background color change
    >
      <Tooltip label={navSize === "small" && name}>
        <Link href={path} w="100%">
          <Box px={2} py={3} borderRadius={8} align="center">
            <Center>
              <Flex alignItems="center">
                {/* Icon representing the nav item */}

                <Icon as={icon} fontSize="xl" color="gray.400" />
                {/* Text label for the nav item, hidden when navSize is small */}

                <Text
                  ml={3}
                  fontSize="sm"
                  display={navSize === "small" ? "none" : "flex"}
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
