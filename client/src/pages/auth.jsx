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
import { Login } from "@/components/authentication/Login";
import DemoLoginInfoModal from "@/components/others/DemoLoginInfoModal";
import logo from "@/assets/TrackMaster_Plain.png";

export const Auth = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <VStack p={5}>
        <Link
          href="https://github.com/AlessandroParente1"
          isExternal
          alignSelf="flex-end"
        >
          {/* GitHub icon link */}

          <Icon as={AiFillGithub} w={8} h={8} />
        </Link>
        <Image width={300} src={logo} alt="logo" />
        <Heading as="h3" size="md" pb="5" fontWeight="semibold">
          Sign in to your account
        </Heading>
        {/* Render the login form */}

        <Login />
        <br />
        <Button onClick={onOpen}>Demo Login Info</Button>
        <DemoLoginInfoModal isOpen={isOpen} onClose={onClose} />
      </VStack>
    </>
  );
};

export default Auth;
