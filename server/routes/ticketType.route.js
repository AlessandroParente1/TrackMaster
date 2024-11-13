import express from 'express';
import { addTicketType, deleteTicketType, updateTicketType, getTicketType } from '../controllers/ticketType.controller.js';
import { checkUserPermissions, validateResource } from "../middleware/middleware.js";
import { createTicketTypeSchema } from '../schema/validation.schema.js';
import { Permissions } from '../util/utils.js';

const router = express.Router();

router.get("/", getTicketType);

router.post("/",
    [
        checkUserPermissions("ticket type", Permissions.canManageAdminPage),
        validateResource(createTicketTypeSchema)
    ],
    addTicketType);

router.patch("/",
    [
        checkUserPermissions("ticket type", Permissions.canManageAdminPage),
        validateResource(createTicketTypeSchema)
    ],
    updateTicketType);

router.delete("/:ticketTypeId",
    [
    checkUserPermissions("ticket type", Permissions.canManageAdminPage),
    ],
    deleteTicketType);

export default router;