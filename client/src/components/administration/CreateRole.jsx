import {
  Alert, Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText,
  FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Spacer, Switch, useDisclosure,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import * as Constants from "@/util/Constants";
import { CreateRoleData, CreateRoleSchema } from "@/util/ValidationSchemas";
import AlertModal from "../others/AlertModal";

// Main component to create or edit a role
const CreateRole = ({ isOpen, onClose, role, mutateServer }) => {
  // Determine if this is a new role or an existing role being edited
  const isNewRole = !role;

  // Hook to manage the state of the deletion confirmation dialog
  const alertDialogDisclosure = useDisclosure();

  // Reference to the form, used for programmatically submitting the form
  const formRef = useRef(null);

  // State to store the current permissions selected for the role
  const [permissions, setPermissions] = useState([]);

  // State to store the data of the role being created or edited
  const [roleData, setRoleData] = useState(CreateRoleData);

  // State to handle any errors during API calls
  const [error, setError] = useState(null);

  // Effect hook to set the role data and permissions when the modal opens
  useEffect(() => {
    if (isOpen && role) {
      setRoleData(role);
      console.log(role.permissions);
      setPermissions(role.permissions);
    }
  }, [isOpen]);

  // Array to define the display permissions with corresponding labels and descriptions
  const displayPermissions = [
    {
      name: "Manage Tickets",
      helperText: "Allows user to create, delete, and modify tickets",
      value: Constants.MANAGE_TICKET,
    },
    {
      name: "Manage Projects",
      helperText: "Allows users to create, delete, and modify their own projects",
      value: Constants.MANAGE_PROJECT,
    },
    {
      name: "Manage Admin Page",
      helperText: "Allows user to access the admin page",
      value: Constants.MANAGE_ADMIN_PAGE,
    },
  ];

  // Function to handle permission toggling
  const onPermissionToggle = ({ target: { checked, value } }) => {
    if (checked) {
      // Add permission to the list
      setPermissions([...permissions, value]);
    } else {
      // Remove permission from the list
      const updatedPermissions = permissions.filter(
          (permission) => permission !== value
      );
      setPermissions(updatedPermissions);
    }
  };

  // Function to reset the form and close the modal
  const closeModal = () => {
    setRoleData(CreateRoleData);
    setPermissions([]);
    setError("");
    onClose();
  };

  // Function to handle role deletion
  const onRoleDelete = async () => {
    alertDialogDisclosure.onClose();
    try {
      const apiRequestInfo = MiscellaneousService.deleteRole(role._id);
      await mutateServer(apiRequestInfo);
      closeModal();
    } catch (error) {
      setError(error);
    }
  };

  // Function to handle form submission (create or update role)
  const onFormSubmit = async (data) => {
    try {
      const roleDataCopy = { ...data, permissions };

      let apiRequestInfo = {};

      if (isNewRole) {
        // Create new role
        apiRequestInfo = MiscellaneousService.createRole(roleDataCopy);
      } else {
        // Update existing role
        apiRequestInfo = MiscellaneousService.updateRole(roleDataCopy);
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
          <ModalHeader>Create New Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={3}>
              <Formik
                  initialValues={roleData} // Initialize form with role data
                  validationSchema={CreateRoleSchema} // Validate form using schema
                  onSubmit={onFormSubmit} // Handle form submission
                  innerRef={formRef} // Reference to the form
                  enableReinitialize // Reinitialize form when roleData changes
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
                      {/* Role Name input field with validation */}
                      <FormControl isInvalid={errors.name && touched.name} pb={2}>
                        <FormLabel>Role Name</FormLabel>
                        <Field as={Input} name="name" type="text" required />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      {/* Render switches for each permission */}
                      {displayPermissions.map((permission, index) => (
                          <FormControl key={index}>
                            <Box display="flex" width="100%">
                              <FormLabel fontSize="sm">{permission.name}</FormLabel>
                              <Spacer />
                              <Switch
                                  colorScheme="blue"
                                  size="lg"
                                  value={permission.value}
                                  onChange={onPermissionToggle} // Handle toggle
                                  isChecked={permissions.includes(permission.value)} // Check if permission is active
                              />
                            </Box>
                            <FormHelperText fontSize="xs" as="i">
                              {permission.helperText}
                            </FormHelperText>
                          </FormControl>
                      ))}
                    </>
                )}
              </Formik>
            </Flex>
          </ModalBody>

          <ModalFooter gap={3}>
            {/* Show "Delete" button if editing an existing role */}
            {role ? (
                <Button colorScheme="red" onClick={alertDialogDisclosure.onOpen}>
                  Delete
                </Button>
            ) : (
                // Show "Cancel" button if creating a new role
                <Button
                    colorScheme="gray"
                    onClick={() => {
                      setPermissions([]);
                      onClose();
                    }}
                >
                  Cancel
                </Button>
            )}
            {/* Button to submit the form (Create or Save) */}
            <Button
                colorScheme="blue"
                onClick={() => formRef.current?.handleSubmit()}
            >
              {isNewRole ? "Create" : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>

        {/* Confirmation dialog for role deletion */}
        <AlertModal
            title={"Delete role"}
            body="Are you sure you want to delete this role?"
            onCTA={onRoleDelete} // Handle delete confirmation
            isOpen={alertDialogDisclosure.isOpen}
            onClose={alertDialogDisclosure.onClose}
        />
      </Modal>
  );
};

export default CreateRole;
