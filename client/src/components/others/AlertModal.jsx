import {
  Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

// AlertModal component for displaying a confirmation modal
const AlertModal = ({ title, body, onCTA, onClose, isOpen }) => {
  return (
    <Modal onClose={onClose} size="sm" isOpen={isOpen}>
      {/* Modal overlay */}
      <ModalOverlay />

      {/* Modal content container */}
      <ModalContent>
        {/* Modal header displaying the title */}
        <ModalHeader>{title}</ModalHeader>

        {/* Button to close the modal */}
        <ModalCloseButton />

        {/* Modal body displaying the message */}
        <ModalBody>{body}</ModalBody>

        {/* Modal footer with action button */}
        <ModalFooter>
          {/* Button to trigger the main action, such as deleting an item */}
          <Button colorScheme="red" onClick={() => onCTA(onClose)}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
