import { usePermissions } from "../../hooks/usePermissions";

// PermissionsRender component to conditionally render children based on permissions

const PermissionsRender = ({ permissionCheck, children }) => {
  // Call usePermissions hook with the permissionCheck prop to determine if rendering is allowed

  const canRender = usePermissions(permissionCheck);

  // Conditionally render children if the user has the required permissions

  if (canRender) {
    return children;
  }
  return null;
};

export default PermissionsRender;
