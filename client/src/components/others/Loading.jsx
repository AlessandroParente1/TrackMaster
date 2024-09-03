import { Center, Spinner } from "@chakra-ui/react";

// Loading component to display a spinner while content is loading
const Loading = () => {
  return (
    <Center w="100%">
      {/* Spinner component to indicate loading */}
      <Spinner color="white" size="xl" />
    </Center>
  );
};

export default Loading;
