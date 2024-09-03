import {
  Alert, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input,
  InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Tooltip,
  useBoolean,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import useApi from "@/hooks/useApi";
import { ManageUserSchema, SignUpData, SignupSchema } from "@/util/ValidationSchemas";

// Main component to create or update a user
const UpdateUser = ({
                      isOpen, // Whether the modal is open
                      closeModal, // Function to close the modal
                      viewUser, // The user data being viewed or edited
                      isUpdateMyProfile = false, // Whether the modal is for updating the current user's profile
                      mutateServer, // Function to trigger a server revalidation
                    }) => {
  // Fetch all roles using SWR (stale-while-revalidate) hook
  const allRolesSWR = useApi(MiscellaneousService.getRoles());

  // Reference to the form, used for programmatically submitting the form
  const formRef = useRef(null);

  // State to handle any errors during form submission or API calls
  const [error, setError] = useState(null);

  // State to manage user information being edited or created
  const [userInfo, setUserInfo] = useState(SignUpData);

  // Boolean to toggle password visibility
  const [showPassword, setShowPassword] = useBoolean();

  // Boolean to determine if the current operation is updating a user's profile
  const isUpdatingUserProfile = !isUpdateMyProfile && viewUser;

  // Set the modal title based on the operation (view, update, or create)
  const modalTitle = isUpdateMyProfile
    ? "My Profile"
    : viewUser
      ? "Update User"
      : "Create User";

  // Effect hook to populate the form with user data when the modal opens
  useEffect(() => {
    if (isOpen && viewUser) {
      const userInfoCopy = {
        _id: viewUser._id,
        firstName: viewUser.firstName,
        lastName: viewUser.lastName,
        roleId: viewUser.roleId?._id,
        email: viewUser.email,
      };

      if (isUpdateMyProfile) {
        userInfoCopy.password = "";
        userInfoCopy.confirmPassword = "";
      }

      setUserInfo(userInfoCopy);
    }
  }, [isOpen]);

  // Function to handle form submission (create or update user)
  const onUpdateUser = async (data) => {
    try {
      let apiRequestInfo;

      if (viewUser) {
        // Update user profile or current user's profile
        apiRequestInfo = isUpdateMyProfile
          ? MiscellaneousService.updateMyProfile(data)
          : MiscellaneousService.updateUserProfile(data);
      } else {
        // Create a new user
        apiRequestInfo = MiscellaneousService.createUser(data);
      }

      await mutateServer(apiRequestInfo);

      setError("");
      onCloseModal();
    } catch (error) {
      console.log("ERROR: ", error);
      setError(error);
    }
  };

  // Function to reset the form and close the modal
  const onCloseModal = () => {
    setShowPassword.off();
    setUserInfo(SignUpData);
    setError("");
    closeModal();
  };

  // Function to create the options for the role selection dropdown
  const createRoleTypeOption = () => {
    return allRolesSWR.data?.map((role) => (
      <option key={role._id} value={role._id}>
        {role.name}
      </option>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Formik form for user data */}
          <Formik
            initialValues={userInfo} // Initialize form with user data
            validationSchema={
              isUpdatingUserProfile ? ManageUserSchema : SignupSchema
            } // Use different schemas for updating profile vs creating/updating user
            onSubmit={onUpdateUser} // Handle form submission
            innerRef={formRef} // Reference to the form
            enableReinitialize // Reinitialize form when userInfo changes
          >
            {({ errors, touched }) => (
              <Form>
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
                <Flex direction={{ base: "column", md: "row" }} gap={3}>
                  {/* First Name input field with validation */}
                  <FormControl
                    isInvalid={errors.firstName && touched.firstName}
                  >
                    <FormLabel>First Name</FormLabel>
                    <Field as={Input} name="firstName" type="text" />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  {/* Last Name input field with validation */}
                  <FormControl isInvalid={errors.lastName && touched.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Field as={Input} name="lastName" type="text" />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>
                </Flex>

                {/* Email input field with validation */}
                <FormControl mt={4} isInvalid={errors.email && touched.email}>
                  <FormLabel>Email</FormLabel>
                  <Field as={Input} name="email" type="email" />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                {/* Role selection dropdown, only shown when not updating profile */}
                {!isUpdateMyProfile ? (
                  <FormControl
                    mt={4}
                    isInvalid={errors.roleId && touched.roleId}
                  >
                    <FormLabel>Role</FormLabel>
                    <Field as={Select} name="roleId" type="select">
                      <option value="" disabled>
                        Select
                      </option>
                      {createRoleTypeOption()}
                    </Field>
                    <FormErrorMessage>{errors.roleId}</FormErrorMessage>
                  </FormControl>
                ) : null}

                {/* Password fields, only shown when not updating an existing user's profile */}
                {!isUpdatingUserProfile ? (
                  <>
                    <FormControl
                      mt={4}
                      isInvalid={errors.password && touched.password}
                    >
                      <FormLabel>Password</FormLabel>
                      <Field
                        as={Input}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        name="password"
                      />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      mt={4}
                      isInvalid={
                        errors.confirmPassword && touched.confirmPassword
                      }
                    >
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup>
                        <Field
                          as={Input}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          name="confirmPassword"
                        />
                        <InputRightElement width="4.5rem">
                          <Button size="sm" onClick={setShowPassword.toggle}>
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.confirmPassword}
                      </FormErrorMessage>
                    </FormControl>
                  </>
                ) : null}
              </Form>
            )}
          </Formik>
        </ModalBody>

        <ModalFooter gap={3}>
          {/* Delete button, only shown when editing a user */}
          {viewUser ? (
            <Tooltip label="Not Implemented">
              <Button colorScheme="red">Delete</Button>
            </Tooltip>
          ) : null}

          {/* Submit button */}
          <Button
            colorScheme="blue"
            onClick={() => formRef.current?.handleSubmit()}
          >
            {!viewUser ? "Create" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateUser;
