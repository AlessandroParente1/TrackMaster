import * as yup from 'yup';
//I used yup to make sure that the data that is being sent to the server is valid and is in the correct format

//used in the create and update user routes
export const createUserSchema = yup.object().shape({
    firstName: yup.string().trim().required("First name required"),
    lastName: yup.string().trim().required("Last name required"),
    email: yup.string().trim().email("Invalid email").required("Email required"),
    password: yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("Password required"),
    confirmPassword: yup.string().oneOf(
        [yup.ref("password"), null],
        "Passwords must match",
    ),
});

//used in the login route
export const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("Required"),
});

//used in the create and update ticket type routes
export const createTicketTypeSchema = yup.object().shape({
    name: yup.string().required("Ticket type name is required"),
    iconName: yup.string().required("Ticket type icon name is required"),
    colour: yup.string()
});

//used in the create and update project routes
export const createProjectSchema = yup.object().shape({
    title: yup.string().trim().required("Project title required"),
    description: yup.string(),
    assignees: yup.array().required("Assignees required"),
});

//used in the create and update ticket routes
export const createTicketSchema = yup.object().shape({
    title: yup.string().trim().required("Ticket title required"),
    status: yup.string().trim().required("Ticket status required"),
    type: yup.string().required("Ticket type required"),
    estimatedTime: yup.number().required("Ticket estimated time required"),
    estimatedTimeUnit: yup.string().required("Ticket estimated time unit required")
});

//used in the create and update role routes
export const createRoleSchema = yup.object().shape({
    name: yup.string().min(1, "Role name cannot be empty").required("Required"),
    permissions: yup.array()
});

//used in the create and update comment routes
export const createCommentSchema = yup.object().shape({
    text: yup.string().trim().min(1, "Comment cannot be empty")
});