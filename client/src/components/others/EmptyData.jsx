import { Center, Image, Text } from "@chakra-ui/react";
import React from "react";
import empty from "@/assets/empty.svg";

// EmptyData component to display a message and image when there is no data
const EmptyData = () => {
  return (
    <Center width="100%" height="100%" flexDir="column">
      {/* Image to represent no data */}
      <Image src={empty} boxSize="150px" alt="Empty Data" />

      {/* Text message indicating no data */}
      <Text fontSize="2xl" as="samp">
        No Data
      </Text>
    </Center>
  );
};

export default EmptyData;
