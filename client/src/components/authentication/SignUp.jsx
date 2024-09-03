import {
  Alert, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input,
  InputGroup, InputRightElement, useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import AuthService from "@/services/auth-service";
import { SignUpData, SignupSchema } from "@/util/ValidationSchemas";

// Main component for user sign-up
export const SignUp = () => {
  // Hook to show toast notifications
  const toast = useToast();

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State to manage error messages
  const [error, seterror] = useState("");

  // Function to toggle password visibility
  const handleClick = () => setShowPassword((prevState) => !prevState);

  // Function to handle form submission for sign-up
  const onHandleFormSubmit = (values, action) => {
    seterror(""); // Clear any previous errors

    AuthService.signup(values) // Call the signup service
        .then(() => {
          // Show success toast notification on successful sign-up
          toast({
            title: "Account created",
            description: "We've created your account for you",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          action.resetForm(); // Reset the form after successful sign-up
        })
        .catch((error) => {
          // Set error message if sign-up fails
          seterror(error.response.data.message);
        });
  };

  return (
      <Box
          w={["full", "md"]} // Set width for responsive design
          p={[8, 10]} // Padding for the container
          mt={[10]} // Margin top for the container
          mx="auto" // Center the container
          background="secondary" // Set background color
          borderRadius={10} // Rounded corners
          boxShadow="md" // Shadow for the container
      >
        {/* Formik form for sign-up */}
        <Formik
            initialValues={SignUpData} // Initial values for the form fields
            validationSchema={SignupSchema} // Validation schema for the form
            onSubmit={onHandleFormSubmit} // Handle form submission
        >
          {({ errors, touched }) => (
              <Form>
                {/* Display error message if there's an error */}
                {error && (
                    <Alert status="error" variant="left-accent" mb={2} fontSize="sm">
                      {error}
                    </Alert>
                )}

                <Flex direction={{ base: "column", md: "row" }} gap={3}>
                  {/* First Name input field with validation */}
                  <FormControl isInvalid={errors.firstName && touched.firstName}>
                    <FormLabel fontWeight="regular">First Name</FormLabel>
                    <Field as={Input} name="firstName" type="text" />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  {/* Last Name input field with validation */}
                  <FormControl isInvalid={errors.lastName && touched.lastName}>
                    <FormLabel fontWeight="regular">Last Name</FormLabel>
                    <Field as={Input} name="lastName" type="text" />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>
                </Flex>

                {/* Email input field with validation */}
                <FormControl mt={4} isInvalid={errors.email && touched.email}>
                  <FormLabel fontWeight="regular">Email</FormLabel>
                  <Field as={Input} name="email" type="email" />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                {/* Password input field with validation */}
                <FormControl mt={4} isInvalid={errors.password && touched.password}>
                  <FormLabel fontWeight="regular">Password</FormLabel>
                  <Field
                      as={Input}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      name="password"
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                {/* Confirm Password input field with validation */}
                <FormControl
                    mt={4}
                    isInvalid={errors.confirmPassword && touched.confirmPassword}
                >
                  <FormLabel fontWeight="regular">Confirm Password</FormLabel>
                  <InputGroup size="md">
                    <Field
                        as={Input}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        name="confirmPassword"
                    />
                    <InputRightElement width="4.5rem">
                      <Button size="sm" onClick={handleClick}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                {/* Sign-up button */}
                <Button colorScheme="blue" w="full" mt={10} type="submit">
                  Sign up
                </Button>
              </Form>
          )}
        </Formik>
      </Box>
  );
};
