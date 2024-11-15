import { useRouter } from "next/router";
import {  Alert,  Box,  Button,  FormControl,  FormErrorMessage,  FormLabel,  Input} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth-service";
import useApi from "@/hooks/useApi";
import useAuthStore from "@/hooks/useAuth";
import { LoginData, LoginSchema } from "@/util/ValidationSchemas";

//Login coordinates sending credentials, handling load status, handling errors, and updating the authentication context if login is successful.
export const Login = () => {
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

  //Login result handling
  useEffect(() => {

    // If login data is not null, set the access token and user profile in authStore
    if (loginSWR.data) {
      authStore.setAccessToken(loginSWR.data.accessToken);
      authStore.setUserProfile(loginSWR.data.userProfile);

      // Reload the page to update the authentication state
      router.reload();
    }
  }, [loginSWR.data]);

  //When the user submits the form
  const onHandleFormSubmit = async (values) => {

    //The error gets resetted
    seterror("");
    //The loading state is set
    setisLogging(true);

    try {
      //The mutateServer function of loginSWR sends the authentication request with the user data.
      //mutateServer is used to update the UI immediately (optimistic modification) without waiting for the server response
      await loginSWR.mutateServer(AuthService.login(values));
    }
    //if the authentication fails
    catch (error) {
      //The error message is set
      seterror(error);
    }
    setisLogging(false);
  };

  return (
    <Box
      w={["full", "md"]}
      p={[8, 10]}
      mt={[10]}
      mx="auto"
      borderRadius={10}
      boxShadow="md"
    >
      <Formik
        initialValues={LoginData}
        validationSchema={LoginSchema}
        onSubmit={onHandleFormSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            {error && (
              <Alert status="error" variant="left-accent" mb={2} fontSize="sm">
                {error}
              </Alert>
            )}

            <FormControl isInvalid={errors.email && touched.email}>
              <FormLabel>Email</FormLabel>
              <Field as={Input} name="email" type="email" />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={errors.password && touched.password}>
              <FormLabel>Password</FormLabel>
              <Field as={Input} name="password" type="password" />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="blue"
              w="full"
              mt={10}
              type="submit"
              isLoading={isLogging}
              loadingText="Logging In"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
