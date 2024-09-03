// User data to seed into the database
export const DBUsers = [
    {
        firstName: "Ad",
        lastName: "min",
        email: "admin@admin.com",
        password: "password"
    },
    {
        firstName: "Dev",
        lastName: "eloper",
        email: "developer@developer.com",
        password: "password"
    },
    {
        firstName: "Sub",
        lastName: "mitter",
        email: "submitter@submitter.com",
        password: "password"
    }
];

// Role data to seed into the database
export const DBRole = [
    {
        name: "Admin", // Role name
        permissions: [ // Array of permissions for the role
            Permissions.MANAGE_TICKET,
            Permissions.MANAGE_PROJECT,
            Permissions.MANAGE_ADMIN_PAGE
        ]
    },
    {
        name: "Developer",
        permissions: [
            Permissions.MANAGE_TICKET,
            Permissions.MANAGE_PROJECT,
        ]
    },
    {
        name: "Submitter",
        permissions: [
            Permissions.MANAGE_TICKET,
        ]
    }
];

// Ticket type data to seed into the database
export const DBTicketType = [
    {
        name: "Feature", // Ticket type name
        iconName: "BsPlusLg", // Associated icon for the ticket type
        colour: "#4ab577" // Colour code for the ticket type
    },
    {
        name: "Bug",
        iconName: "BsBugFill",
        colour: "#e25555"
    },
    {
        name: "Documentation",
        iconName: "BsFileEarmarkText",
        colour: "#ED8936",
    },
    {
        name: "Support",
        iconName: "BsQuestion",
        colour: "#4299E1",
    }
];
