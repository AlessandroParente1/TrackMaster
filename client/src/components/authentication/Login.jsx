import { signInWithGoogle, handleRedirectResult } from "@/firebaseConfig";
import { useRouter } from "next/router";
import { Alert, Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth-service";
import useApi from "@/hooks/useApi";
import useAuthStore from "@/hooks/useAuth";
import { LoginData, LoginSchema } from "@/util/ValidationSchemas";

// Main component for user login
const Login = () => {
  // State to manage error messages
  const [error, seterror] = useState("");

  // State to manage the loading state during login
  const [isLogging, setisLogging] = useState(false);

  // Hook to manage routing in Next.js
  const router = useRouter();

  // Custom hook to manage API calls
  const loginSWR = useApi(null);

  // Custom hook to access authentication store
  const authStore = useAuthStore();

  // Effect to handle the redirect result after Google sign-in
  useEffect(() => {
    handleRedirectResult();
  }, []);

  // Effect to update the authentication store and reload the page after a successful login
  useEffect(() => {
    if (loginSWR.data) {
      authStore.setAccessToken(loginSWR.data.accessToken); // Store the access token
      authStore.setUserProfile(loginSWR.data.userProfile); // Store the user profile
      router.reload(); // Reload the page to reflect the logged-in state
    }
  }, [loginSWR.data]);

  // Function to handle form submission for email/password login
  const onHandleFormSubmit = async (values) => {
    seterror(""); // Clear any previous errors
    setisLogging(true); // Set loading state to true

    try {
      await loginSWR.mutateServer(AuthService.login(values)); // Call the login service
    } catch (error) {
      seterror(error); // Set error if login fails
    }
    setisLogging(false); // Set loading state to false
  };

  // Function to handle Google login
  const handleGoogleLogin = async () => {
    seterror(""); // Clear any previous errors
    setisLogging(true); // Set loading state to true
    try {
      await signInWithGoogle(); // Initiate Google login
    } catch (error) {
      seterror(error.message); // Set error if Google login fails
    }
    setisLogging(false); // Set loading state to false
  };

  return (
    <Box
      w={["full", "md"]} // Set width for responsive design
      p={[8, 10]} // Padding for the container
      mt={[10]} // Margin top for the container
      mx="auto" // Center the container
      borderRadius={10} // Rounded corners
      boxShadow="md" // Shadow for the container
    >
      {/* Formik form for login */}
      <Formik
        initialValues={LoginData} // Initial values for the form fields
        validationSchema={LoginSchema} // Validation schema for the form
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

            {/* Email input field with validation */}
            <FormControl isInvalid={errors.email && touched.email}>
              <FormLabel>Email</FormLabel>
              <Field as={Input} name="email" type="email" />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            {/* Password input field with validation */}
            <FormControl mt={4} isInvalid={errors.password && touched.password}>
              <FormLabel>Password</FormLabel>
              <Field as={Input} name="password" type="password" />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            {/* Login button */}
            <Button
              colorScheme="blue"
              w="full"
              mt={10}
              type="submit"
              isLoading={isLogging} // Show loading state if isLogging is true
              loadingText="Logging In"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>

      {/* Google login button */}
      <Button colorScheme="red" w="full" mt={4} onClick={handleGoogleLogin}>
        Login with Google
      </Button>
    </Box>
  );
};

export default Login;
