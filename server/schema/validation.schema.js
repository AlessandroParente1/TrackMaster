import * as yup from 'yup';

export const createUserSchema = yup.object().shape({
    firstName: yup.string().trim().required("First name required"),  // Validates that firstName is a string, trimmed, and required.
    lastName: yup.string().trim().required("Last name required"),  // Validates that lastName is a string, trimmed, and required.
    email: yup.string().trim().email("Invalid email").required("Email required"),  // Validates that email is a valid email format and required.
    password: yup.string()
        .min(6, "Password must be at least 6 characters long")  // Validates that password has a minimum length of 6 characters.
        .required("Password required"),  // Ensures that password is required.
    confirmPassword: yup.string().oneOf(
        [yup.ref("password"), null],  // Ensures that confirmPassword matches the password field.
        "Passwords must match",  // Error message if passwords do not match.
    ),
});


export const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Required"),  // Validates that email is a valid email format and required.
    password: yup.string()
        .min(6, "Password must be at least 6 characters long")  // Validates that password has a minimum length of 6 characters.
        .required("Required"),  // Ensures that password is required.
});


export const createTicketTypeSchema = yup.object().shape({
    name: yup.string().required("Ticket type name is required"),  // Validates that name is a string and required.
    iconName: yup.string().required("Ticket type icon name is required"),  // Validates that iconName is a string and required.
    colour: yup.string()  // Validates that colour is a string (not required).
});


export const createProjectSchema = yup.object().shape({
    title: yup.string().trim().required("Project title required"),  // Validates that title is a string, trimmed, and required.
    description: yup.string(),  // Validates that description is a string (optional).
    assignees: yup.array().required("Assignees required"),  // Validates that assignees is an array and required.
});


export const createTicketSchema = yup.object().shape({
    title: yup.string().trim().required("Ticket title required"),  // Validates that title is a string, trimmed, and required.
    status: yup.string().trim().required("Ticket status required"),  // Validates that status is a string, trimmed, and required.
    type: yup.string().required("Ticket type required"),  // Validates that type is a string and required.
    estimatedTime: yup.number().required("Ticket estimated time required"),  // Validates that estimatedTime is a number and required.
    estimatedTimeUnit: yup.string().required("Ticket estimated time unit required")  // Validates that estimatedTimeUnit is a string and required.
});


export const createRoleSchema = yup.object().shape({
    name: yup.string().min(1, "Role name cannot be empty").required("Required"),  // Validates that name is a string, has a minimum length of 1, and is required.
    permissions: yup.array()  // Validates that permissions is an array (optional).
});


export const createCommentSchema = yup.object().shape({
    text: yup.string().trim().min(1, "Comment cannot be empty")  // Validates that text is a string, trimmed, has a minimum length of 1 if provided.
});
