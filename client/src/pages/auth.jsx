import Image from "next/image";
import {
  Button,
  Heading,
  Icon,
  Link,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillGithub } from "react-icons/ai";
import Login from "@/components/authentication/Login.jsx";
import DemoLoginInfoModal from "@/components/others/DemoLoginInfoModal";
import logo from "@/assets/TrackMaster_Plain.png";

export const Auth = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Manage the open/close state of the demo login modal

  return (
    <>
      <VStack p={5}>
        <Link
          href="https://github.com/BelloFigoGu1"
          isExternal
          alignSelf="flex-end"
        >
          {/* GitHub icon link */}
          <Icon as={AiFillGithub} w={8} h={8} />
        </Link>
        {/* Display the logo */}
        <Image width={300} src={logo} alt="logo" />
        <Heading as="h3" size="md" pb="5" fontWeight="semibold">
          Sign in to your account
        </Heading>
        {/* Render the login form */}
        <Login />
        <br />
        {/* Button to open the demo login info modal */}
        <Button onClick={onOpen}>Demo Login Info</Button>
        {/* Modal for demo login info */}
        <DemoLoginInfoModal isOpen={isOpen} onClose={onClose} />
      </VStack>
    </>
  );
};

export default Auth;
