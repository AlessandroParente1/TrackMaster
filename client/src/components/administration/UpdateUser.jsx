import {  Alert,  Button,  Flex,  FormControl,  FormErrorMessage,  FormLabel,  Input,  InputGroup,  InputRightElement,  Modal,  ModalBody,  ModalCloseButton,  ModalContent,  ModalFooter,  ModalHeader,  ModalOverlay,  Select,  Tooltip,  useBoolean} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import useApi from "@/hooks/useApi";
import {  ManageUserSchema,  SignUpData,  SignupSchema} from "@/util/ValidationSchemas";


//manages the logic for updating, creating, and displaying a user's information
const UpdateUser = ({
  isOpen,
  closeModal,
  viewUser,
  isUpdateMyProfile = false,
  mutateServer, //Function to perform the operation on the server (e.g. send the update or user creation request).
}) => {
  // Use the useApi hook to retrieve all roles from a remote service. SWR (stale-while-revalidate) is used for loading data in a responsive and optimized manner.
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
    ? "My Profile" //If isUpdateMyProfile is true, the title is "My Profile".
    : viewUser
    ? "Update User"//If there is a user to view (viewUser), the title is "Update User".
    : "Create User";//If neither of the two previous conditions are met, the title will be "Create User", which is the case of creating a new user.

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

      //and the user is updating their profile (isUpdateMyProfile), passwords are left blank.
      if (isUpdateMyProfile) {
        userInfoCopy.password = "";
        userInfoCopy.confirmPassword = "";
      }

      setUserInfo(userInfoCopy);
    }
  }, [isOpen]);

  //This function is called when the form is submitted. (to update or create a user)
  const onUpdateUser = async (data) => {
    try {
      let apiRequestInfo;

      //If viewUser is defined, the existing user is updated.
      if (viewUser) {
        // Update user profile or current user's profile

        apiRequestInfo = isUpdateMyProfile
            //If isUpdateMyProfile is true, the operation is to update the current user's profile,
            // so MiscellaneousService.updateMyProfile(data) is called
            ? MiscellaneousService.updateMyProfile(data)

            //Otherwise, MiscellaneousService.updateUserProfile(data) is called to update another user.
          : MiscellaneousService.updateUserProfile(data);
      }
      //If viewUser is not defined (you are creating a new user), MiscellaneousService.createUser(data) is called.
      else {
        apiRequestInfo = MiscellaneousService.createUser(data);
      }
      // Create a new user

        //After the operation is performed, mutateServer is called to update the UI.
      await mutateServer(apiRequestInfo);

      setError("");
      onCloseModal();
    } catch (error) {
      console.log("ERROR: ", error);
      setError(error);
    }
  };

  //Resets the state to null for accessToken and userProfile, essentially "logging out" the user.
  const onCloseModal = () => {
    setShowPassword.off();
    setUserInfo(SignUpData);
    setError("");
    closeModal();
  };

  // Function to create the options for the role selection dropdown (menù a discesa)

  const createRoleTypeOption = () => {
    //By using the data fetched from allRolesSWR, a list of <option> elements is generated
    return allRolesSWR.data?.map((role) => (
        //Every role gets represented by an option
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
            initialValues={userInfo}
            validationSchema={
              isUpdatingUserProfile ? ManageUserSchema : SignupSchema
            } // Use different schemas for updating profile vs creating/updating user
            onSubmit={onUpdateUser}
            innerRef={formRef}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form>
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
                  <FormControl
                    isInvalid={errors.firstName && touched.firstName}
                  >
                    <FormLabel>First Name</FormLabel>
                    <Field as={Input} name="firstName" type="text" />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.lastName && touched.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Field as={Input} name="lastName" type="text" />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>
                </Flex>

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
            <Tooltip label="Not Implemeted">
              <Button colorScheme="red">Delete</Button>
            </Tooltip>
          ) : null}

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
