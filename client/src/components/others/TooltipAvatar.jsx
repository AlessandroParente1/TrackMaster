import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";

// TooltipAvatar component to display an avatar with a tooltip
const TooltipAvatar = (props) => {
  return (
    // Tooltip component wrapping the Avatar
    <Tooltip label={props.name}>
      {/* Avatar component displays the user's avatar */}
      <Avatar {...props} />
    </Tooltip>
  );
};

export default TooltipAvatar;
