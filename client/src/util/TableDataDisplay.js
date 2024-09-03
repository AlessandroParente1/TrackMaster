import moment from "moment";
import { AvatarGroup, Badge, Icon, Tooltip } from "@chakra-ui/react";
import * as BsIcon from "react-icons/bs";
import TooltipAvatar from "../components/others/TooltipAvatar";
import { getUserFullname } from "./Utils";

// Default sort order for tickets
export const TICKETS_DEFAULT_SORT = { name: 'createdOn', dir: -1 };

// Column definitions for projects
export const PROJECTS_COLUMNS = [
    {
        name: "title",
        searchInField: ["title"], // Fields to search in for this column
        header: "TITLE", // Column header text
        flex: 1, // Flex property for column width
        render: ({ value }) => {
            // Custom render function for displaying the title
            return <span style={styles}>{value}</span>;
        }
    },
    {
        name: "authorId",
        header: "AUTHOR",
        flex: 1,
        render: ({ value }) => {
            // Display the author's full name
            return value.firstName + " " + value.lastName;
        }
    },
    {
        name: "createdOn",
        searchInField: ["createdOn"],
        header: "CREATED ON",
        flex: 1,
        headerProps: {
            style: {
                backgroundColor: "#334154" // Custom header background color
            }
        },
        render: ({ value }) => {
            // Format and display the creation date
            return moment(value).format("MMMM DD, YYYY");
        }
    }
];

// Column definitions for tickets
export const TICKETS_COLUMNS = [
    {
        name: "type",
        searchInField: ["type.name"],
        header: "TYPE",
        width: 55,
        headerEllipsis: false,
        render: ({ value }) => {
            const { iconName, colour, name } = value;
            return (
                <Tooltip label={name}>
                    <span>
                        {/* Display ticket type icon */}
                        <Icon as={BsIcon[iconName]} bg={colour} color="gray.50" w={6} h={6} p={1} borderRadius={5} />
                    </span>
                </Tooltip>
            );
        },
    },
    {
        name: "title",
        searchInField: ["title"],
        header: "TITLE",
        flex: 3,
        render: ({ value }) => {
            // Display the ticket title
            return <span style={styles}>{value}</span>;
        },
    },
    {
        name: "description",
        defaultVisible: false,
        header: "DESCRIPTION",
        flex: 3,
    },
    {
        name: "status",
        searchInField: ["status"],
        header: "STATUS",
        flex: 1,
        render: ({ value }) => {
            // Display ticket status with different colors
            switch (value) {
                case "Open":
                    return <Badge colorScheme='orange'>{value}</Badge>;
                case "In-Progress":
                    return <Badge colorScheme='blue'>{value}</Badge>;
                case "Done":
                    return <Badge colorScheme='green'>{value}</Badge>;
                case "Archived":
                    return <Badge colorScheme='facebook'>{value}</Badge>;
                default:
                    return <Badge colorScheme='green'>{value}</Badge>;
            }
        },
    },
    {
        name: "assignees",
        header: "ASSIGNEES",
        flex: 1,
        render: ({ value }) => {
            // Display a group of avatars for assignees
            return (
                <AvatarGroup size="sm" max={5}>
                    {
                        value.map(assignee => (
                            <TooltipAvatar key={assignee._id} name={assignee.firstName + " " + assignee.lastName} />
                        ))
                    }
                </AvatarGroup>
            );
        },

    },
    {
        name: "createdBy",
        header: "CREATED BY",
        flex: 1,
        render: ({ data }) => {
            // Display the name of the person who created the ticket
            return data.createdBy.firstName + " " + data.createdBy.lastName;
        },

    },
    {
        name: "createdOn",
        searchInField: ["createdOn"],
        header: "CREATED ON",
        flex: 1,
        render: ({ value }) => {
            // Format and display the creation date
            return moment(value).format("MMMM DD, YYYY");
        },
    }
];

// Column definitions for tickets assigned to the current user
export const MY_TICKETS_COLUMNS = [
    {
        name: "type",
        searchInField: ["type.name"],
        header: "TYPE",
        width: 55,
        headerEllipsis: false,
        render: ({ value }) => {
            const { iconName, colour, name } = value;
            return (
                <Tooltip label={name}>
                    <span>
                        {/* Display ticket type icon */}
                        <Icon as={BsIcon[iconName]} bg={colour} color="gray.50" w={6} h={6} p={1} borderRadius={5} />
                    </span>
                </Tooltip>
            );
        },
    },
    {
        name: "projectId",
        searchInField: ["projectId.title"],
        header: "PROJECT",
        flex: 1,
        render: ({ data }) => {
            // Display the title of the project associated with the ticket
            return <span style={styles}>{data.projectId.title}</span>;
        },
    },
    {
        name: "title",
        searchInField: ["title"],
        header: "TITLE",
        flex: 3,
        render: ({ value }) => {
            // Display the ticket title
            return <span style={styles}>{value}</span>;
        },
    },
    {
        name: "status",
        searchInField: ["status"],
        header: "STATUS",
        flex: 1,
        render: ({ value }) => {
            // Display ticket status with different colors
            switch (value) {
                case "Open":
                    return <Badge colorScheme='orange'>{value}</Badge>;
                case "In-Progress":
                    return <Badge colorScheme='blue'>{value}</Badge>;
                case "Done":
                    return <Badge colorScheme='green'>{value}</Badge>;
                case "Archived":
                    return <Badge colorScheme='facebook'>{value}</Badge>;
                default:
                    return <Badge colorScheme='green'>{value}</Badge>;
            }
        },
    },
    {
        name: "assignees",
        header: "ASSIGNEES",
        flex: 1,
        render: ({ value }) => {
            // Display a group of avatars for assignees
            return (
                <AvatarGroup size="sm" max={5}>
                    {
                        value.map(assignee => (
                            <TooltipAvatar key={assignee._id} name={assignee.firstName + " " + assignee.lastName} />
                        ))
                    }
                </AvatarGroup>
            );
        },

    },
    {
        name: "createdBy",
        header: "CREATED BY",
        flex: 1,
        render: ({ data }) => {
            // Display the name of the person who created the ticket
            return data.createdBy.firstName + " " + data.createdBy.lastName;
        },

    }
];

// Column definitions for users
export const USERS_COLUMNS = [
    {
        name: "_id",
        searchInField: ["firstName", "lastName"],
        header: "NAME",
        flex: 1,
        render: ({ data }) => {
            // Display user's full name
            return data.firstName + " " + data.lastName;
        }
    },
    {
        name: "roleId",
        header: "ROLE",
        flex: 1,
        render: ({ data }) => {
            // Display the user's role
            return data.roleId.name;
        }
    }
];

// Column definitions for project assignees
export const PROJECT_ASSIGNEES_COLUMNS = [
    {
        name: "_id",
        searchInField: ["firstName", "lastName"],
        header: "NAME",
        flex: 1,
        render: ({ data }) => {
            // Display assignee's full name
            return data.firstName + " " + data.lastName;
        }
    },
    {
        name: "assignees",
        header: "ROLE",
        flex: 1,
        render: ({ data }) => {
            // Display assignee's role
            return data.roleId.name;
        }
    }
];

// Column definitions for managing users
export const MANAGE_USERS_COLUMNS = [
    {
        name: "_id",
        searchInField: ["firstName", "lastName"],
        header: "NAME",
        flex: 1,
        render: ({ data }) => {
            // Display full name of the user
            return (
                <span style={styles}>
                    {getUserFullname(data)}
                </span>
            );
        }
    },
    {
        name: "email",
        searchInField: ["email"],
        header: "EMAIL",
        flex: 1
    },
    {
        name: "roleId",
        header: "ROLE",
        flex: 1,
        render: ({ value }) => {
            // Display role name or "No Data" if not available
            return value?.name || "No Data";
        }
    }
];

// Column definitions for managing roles
export const MANAGE_ROLES = [
    {
        name: "name",
        header: "ROLE NAME",
        searchInField: ["name"],
        render: ({ value }) => {
            // Display role name
            return (
                <span style={styles}>
                    {value}
                </span>
            );
        },
        flex: 1
    },
    {
        name: "permissions",
        header: "PERMISSIONS",
        flex: 5,
        render: ({ value }) => {
            // Display list of permissions or a message if none are available
            if (value.length > 0) {
                return value.map((permission, index) =>
                    <p key={index}>{permission}</p>
                );
            }
            else {
                return "--No Permissions--";
            }
        }
    }
];

// Column definitions for managing ticket types
export const MANAGE_TICKET_TYPES_COLUMNS = [
    {
        name: "_id",
        header: "ICON",
        searchInField: ["name"],
        width: 55,
        headerEllipsis: false,
        render: ({ data }) => {
            const { iconName, colour } = data;
            return (
                <Icon as={BsIcon[iconName]} bg={colour} color="gray.50" w={6} h={6} p={1} borderRadius={5} />
            );
        }
    },
    {
        name: "name",
        header: "ICON NAME",
        flex: 1,
        searchInField: ["iconName"],
        render: ({ data }) => <span style={styles}>{data.name}</span>
    }
];

// Column definitions for icons
export const ICONS_COLUMNS = [
    {
        name: "icon",
        header: "ICON",
        headerEllipsis: false,
        width: 55,
    },
    {
        name: "name",
        header: "NAME",
        searchInField: ["name"],
        flex: 1,
        render: ({ value }) => <span style={styles}>{value}</span>
    }
];
