import * as Permissions from "../util/constants.js";

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

export const DBRole = [
    {
        name: "Admin",
        permissions: [
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
    },
];

export const DBTicketType = [
    {
        name: "Feature",
        iconName: "BsPlusLg",
        colour: "#4ab577"
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