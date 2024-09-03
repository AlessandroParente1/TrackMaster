import {
  Card, CardBody, Center, Icon, Stat, StatLabel, StatNumber, useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

// StatCard component to display a statistical value with an associated icon
const StatCard = ({ iconBackground, iconColor, icon, name, value }) => {
  // Determine background color based on color mode (light or dark)
  const bg = useColorModeValue(iconBackground, iconBackground);

  return (
    <Card direction="row" align="center" px={2} flex="1" boxShadow="xs">
      {/* Icon container with background color */}
      <Center background={bg} borderRadius={5} p={1}>
        {/* Icon component with specified icon and color */}
        <Icon as={icon} w={7} h={7} color={iconColor} />
      </Center>

      {/* Card body containing the stat label and number */}
      <CardBody>
        <Stat alignContent="center">
          {/* Label for the stat */}
          <StatLabel>{name}</StatLabel>
          {/* Value for the stat */}
          <StatNumber>{value}</StatNumber>
        </Stat>
      </CardBody>
    </Card>
  );
};

export default StatCard;
