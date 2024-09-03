import * as Constants from "./Constants.js";

// Function to check if the user has permission to manage tickets
const canManageTickets = (permissionsList) => permissionsList.includes(Constants.MANAGE_TICKET);

// Function to check if the user has permission to manage projects
const canManageProjects = (permissionsList) => permissionsList.includes(Constants.MANAGE_PROJECT);

// Function to check if the user has permission to manage the admin page
const canManageAdminPage = (permissionsList) => permissionsList.includes(Constants.MANAGE_ADMIN_PAGE);

// Exported object containing permission checking functions
export const Permissions = {
    canManageTickets,
    canManageProjects,
    canManageAdminPage
};

// Function to create a list of <option> elements for selecting ticket types
export const createTicketTypeSelectOptions = (ticketTypes) => {
    return ticketTypes.map((ticketType) => (
        <option key={ticketType._id} value={ticketType._id}>
            {ticketType.name}
        </option>
    ));
};

// Function to create a list of <option> elements for selecting ticket status
export const createTicketStatusSelectOptions = () => {
    return Constants.TICKET_STATUS.map((status, index) => (
        <option key={index} value={status}>
            {status}
        </option>
    ));
};

// Function to convert a HEX color to an RGBA color with specified opacity
export const hexToRgb = (hex, opacity) => {
    // Regular expression to parse HEX color
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) {
        // Return a default color if HEX parsing fails
        return `rgba(0, 0, 0, ${opacity})`;
    }

    // Convert HEX values to decimal
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    // Return the RGBA color string
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Function to get the full name of a user from an object
export const getUserFullname = (object) => {
    // Concatenate first name and last name
    return object?.firstName + " " + object?.lastName;
};
