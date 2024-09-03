import {
  Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr,
} from "@chakra-ui/react";
import React from "react";
import { DEMO_LOGIN_INFO } from "@/util/Constants";

// DemoLoginInfoModal component to display demo login information in a table
const DemoLoginInfoModal = ({ isOpen, onClose }) => {
  return (
      <Modal isOpen={isOpen} onClose={onClose}>
        {/* Modal overlay */}
        <ModalOverlay />

        {/* Modal content container */}
        <ModalContent>
          {/* Modal header displaying the title */}
          <ModalHeader>Demo Login Info</ModalHeader>

          {/* Button to close the modal */}
          <ModalCloseButton />

          {/* Modal body containing the table with demo login information */}
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                {/* Table header defining the column names */}
                <Thead>
                  <Tr>
                    <Th>Email</Th>
                    <Th>Password</Th>
                    <Th>Role</Th>
                  </Tr>
                </Thead>

                {/* Table body with dynamic rows generated from DEMO_LOGIN_INFO array */}
                <Tbody>
                  {DEMO_LOGIN_INFO.map((loginInfo, index) => (
                      <Tr key={index}>
                        <Td>{loginInfo.email}</Td>
                        <Td>{loginInfo.password}</Td>
                        <Td>{loginInfo.role}</Td>
                      </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>

          {/* Modal footer with a button to close the modal */}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
};

export default DemoLoginInfoModal;
