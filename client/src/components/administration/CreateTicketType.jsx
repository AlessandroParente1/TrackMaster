import Link from "next/link";
import {
  Alert, Button, Flex, FormControl, FormErrorMessage, FormLabel, Icon, Input,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Text, useDisclosure,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import { CreateTicketTypeData, CreateTicketTypeSchema } from "@/util/ValidationSchemas";
import AlertModal from "../others/AlertModal";
import SearchBar from "../others/SearchBar";

// Main component to create or edit a ticket type
const CreateTicketType = ({ isOpen, onClose, ticketType, mutateServer }) => {
  // Determine if this is a new ticket type or an existing one being edited
  const isNewTicketType = !ticketType;

  // State to store the current ticket type data being created or edited
  const [ticketTypeData, setTicketTypeData] = useState(CreateTicketTypeData);

  // State to manage the icon color for the ticket type
  const [iconColour, setIconColour] = useState("#000000");

  // State to manage the selected icon for the ticket type
  const [selectedIcon, setSelectedIcon] = useState(null);

  // State to manage the name of the selected icon
  const [iconName, setIconName] = useState(null);

  // State to handle any errors during form submission or API calls
  const [error, setError] = useState("");

  // Reference to the form, used for programmatically submitting the form
  const formRef = useRef(null);

  // Hook to manage the state of the deletion confirmation dialog
  const alertDialogDisclosure = useDisclosure();

  let bsIcons = null;

  // Effect hook to set the ticket type data, color, and icon when the modal opens
  useEffect(() => {
    if (isOpen && ticketType) {
      setTicketTypeData(ticketType);
      setIconColour(ticketType.colour);
      getIcon(ticketType.iconName);
    }
  }, [isOpen]);

  // Function to asynchronously load and set the selected icon based on the icon name
  const getIcon = async (iconName) => {
    try {
      bsIcons = await import("react-icons/bs");
      if (bsIcons[iconName]) {
        setSelectedIcon(() => bsIcons[iconName]);
        setIconName(iconName);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle the icon search input change
  const onIconSearch = ({ target: { value } }) => {
    const trimmedValue = value.trim();
    getIcon(trimmedValue);
  };

  // Function to handle the color change for the icon
  const onColourChange = ({ target: { value } }) => {
    setIconColour(value);
  };

  // Function to reset the form and close the modal
  const closeModal = () => {
    setError("");
    setIconColour("#000000");
    setSelectedIcon(null);
    setTicketTypeData(CreateTicketTypeData);
    onClose();
  };

  // Function to handle the deletion of a ticket type
  const deleteTicketType = async () => {
    alertDialogDisclosure.onClose();
    try {
      const apiRequestInfo = MiscellaneousService.deleteTicketType(
        ticketTypeData._id
      );
      await mutateServer(apiRequestInfo);
      closeModal();
    } catch (error) {
      setError(error);
    }
  };

  // Function to handle form submission (create or update ticket type)
  const onFormSubmit = async (data) => {
    console.log("FORM");
    if (!iconName) {
      setError("Must select an icon");
      return;
    }

    try {
      const ticketTypeCopy = { ...data, iconName, colour: iconColour };
      let apiRequestInfo;

      if (isNewTicketType) {
        // Create a new ticket type
        apiRequestInfo = MiscellaneousService.createTicketType(ticketTypeCopy);
      } else {
        // Update an existing ticket type
        apiRequestInfo = MiscellaneousService.updateTicketType(ticketTypeCopy);
      }

      await mutateServer(apiRequestInfo);

      closeModal();
    } catch (error) {
      setError(error);
    }
  };

  // JSX to render the modal and form elements
  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isNewTicketType ? "Update" : "Create"} Ticket Type
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={3}>
            {/* Icon preview section */}
            <Flex gap={2}>
              <Text as="b">Preview:</Text>
              {selectedIcon ? (
                <Icon
                  as={selectedIcon}
                  bg={iconColour}
                  color="gray.50"
                  w={6}
                  h={6}
                  p={1}
                  borderRadius={5}
                />
              ) : null}
            </Flex>

            {/* Formik form for ticket type data */}
            <Formik
              initialValues={ticketTypeData} // Initialize form with ticket type data
              validationSchema={CreateTicketTypeSchema} // Validate form using schema
              onSubmit={onFormSubmit} // Handle form submission
              innerRef={formRef} // Reference to the form
              enableReinitialize // Reinitialize form when ticketTypeData changes
            >
              {({ errors, touched }) => (
                <>
                  {/* Display error message if there's an error */}
                  {error && (
                    <Alert
                      status="error"
                      variant="left-accent"
                      mb={2}
                      fontSize="sm"
                    >
                      {error}
                    </Alert>
                  )}
                  <Flex gap={3}>
                    {/* Ticket type name input field with validation */}
                    <FormControl isInvalid={errors.name && touched.name}>
                      <FormLabel>Ticket Type Name</FormLabel>
                      <Field as={Input} name="name" type="text" required />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    {/* Color picker for icon color */}
                    <FormControl isInvalid={errors.colour && touched.colour}>
                      <FormLabel>Colour (select icon colour)</FormLabel>
                      <Field
                        as={Input}
                        name="colour"
                        type="color"
                        value={iconColour}
                        onChange={onColourChange} // Handle color change
                      />
                      <FormErrorMessage>{errors.colour}</FormErrorMessage>
                    </FormControl>
                  </Flex>

                  {/* Icon selection section */}
                  <FormControl>
                    <FormLabel fontWeight="bold" font color="inputLabel">
                      Select an Icon
                      <Link
                        href="https://react-icons.github.io/react-icons/icons?name=bs"
                        passHref
                        target="_blank"
                      >
                        (Click Here)
                      </Link>
                    </FormLabel>
                    <SearchBar
                      handleSearchInputChange={onIconSearch} // Handle icon search
                      placeholder="Search for icon"
                      variant="outline"
                    />
                  </FormControl>
                </>
              )}
            </Formik>
          </Flex>
        </ModalBody>

        <ModalFooter gap={3}>
          {/* Show "Delete" button if editing an existing ticket type */}
          {!isNewTicketType ? (
            <Button colorScheme="red" onClick={alertDialogDisclosure.onOpen}>
              Delete
            </Button>
          ) : (
            // Show "Cancel" button if creating a new ticket type
            <Button colorScheme="gray" onClick={closeModal}>
              Cancel
            </Button>
          )}
          {/* Button to submit the form (Create or Save) */}
          <Button
            colorScheme="blue"
            onClick={() => {
              console.log("create ticket type", formRef.current);
              formRef.current?.handleSubmit();
            }}
          >
            {isNewTicketType ? "Create" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Confirmation dialog for ticket type deletion */}
      <AlertModal
        title={"Delete Ticket Type"}
        body={`Are you sure you want to delete this "${ticketTypeData.name}" ticket type?`}
        onCTA={deleteTicketType} // Handle delete confirmation
        onClose={alertDialogDisclosure.onClose}
        isOpen={alertDialogDisclosure.isOpen}
      />
    </Modal>
  );
};

export default CreateTicketType;
