import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";
import mongoose from "mongoose";

// Create a new project
export const addProject = async (req, res) => {
    const { title, assignees } = req.body;
    const description = req.body.description || "";

    try {
        const userId = req.user._id;

        const existingProject = await Project.findOne({ title, authorId: userId });

        if (existingProject) {
            return res.status(400).json({ message: "Project already exist with that title" });
        }

        if (!assignees.includes(userId.toString())) {
            assignees.push(userId);
        }

        let newProject = await Project.create({ title, description, authorId: userId, assignees });
        newProject = await newProject.populate([
            { path: "authorId", select: ["firstName", "lastName"] }
        ]);

        const updateAssigneeProjectList = [];

        assignees.forEach(userId => {
            const updateUser = User.updateOne(
                { _id: userId },
                { $push: { projects: newProject._id } }
            );

            updateAssigneeProjectList.push(updateUser);
        });

        await Promise.all(updateAssigneeProjectList);

        return res.json(newProject);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server issue" });
    };
};

// Get all projects for the signed-in user
export const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await Project.find({ assignees: userId })
            .populate({ path: "authorId", select: ["firstName", "lastName"] });

        return res.json(projects);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

// Get detailed project information
export const getProjectInfo = async (req, res) => {
    const { projectId } = req.params;
    try {
        const userId = req.user._id;

        const project = await Project.find({ _id: projectId, assignees: userId })
            .populate({ path: "authorId", select: { firstName: 1, lastName: 1 } })
            .populate({ path: "assignees", select: { firstName: 1, lastName: 1 }, populate: { path: "roleId", select: { _id: 0, name: 1 } } });

        if (project.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.json(project[0]);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

// Update a project
export const updateProject = async (req, res) => {
    const { title, assignees } = req.body;
    const description = req.body.description || "";
    const { projectId } = req.params;

    try {
        const userId = req.user._id;

        let project = await Project.findOne({ _id: projectId, authorId: userId });

        if (!project) {
            return res.status(403).json({ message: "Not authorized to modify projects" });
        }

        if (!assignees.includes(userId)) {
            assignees.push(userId.toString());
        }

        const removedAssignees = project.assignees.filter(assigneeId => !assignees.includes(assigneeId.toString()));

        const updateTicketAssigneesPromise = removedAssignees.map(assigneeId => {
            const updateTicketPromise = new Promise(async (resolve, reject) => {
                try {
                    await Ticket.updateMany({ assignees: assigneeId, projectId }, { $pull: { assignees: new mongoose.Types.ObjectId(assigneeId) } });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });

            return updateTicketPromise;
        });

        await Promise.all(updateTicketAssigneesPromise);

        const assigneesSet = new Set(assignees);

        project.title = title;
        project.description = description;
        project.assignees = Array.from(assigneesSet);
        project.updatedOn = Date.now();

        let updatedProject = await project.save({ new: true });

        updatedProject = await updatedProject.populate([
            { path: "authorId", select: { firstName: 1, lastName: 1 } },
            { path: "assignees", select: { firstName: 1, lastName: 1 }, populate: { path: "roleId", select: { _id: 0, name: 1 } } }
        ]);

        return res.json(updatedProject);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

// Delete a project and its associated tickets
export const deleteProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const userId = req.user._id;

        const project = await Project.findOne({ _id: projectId, authorId: userId });

        if (!project) {
            return res.status(403).json({ message: "Not authorized to delete project" });
        }

        await Project.deleteOne({ _id: projectId });

        await Ticket.deleteMany({ projectId });

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

// Get statistics for a project
export const getProjectStat = async (req, res) => {
    const { projectId } = req.params;

    try {
        const userId = req.user._id;

        const project = await Project.findOne({ _id: projectId, assignees: userId });

        if (!project) {
            return res.status(403).json({ message: "Not authorized to view project -" });
        }

        const ticketCount = await Ticket.find({ projectId }).count();
        const myTicketCount = await Ticket.find({ projectId, assignees: userId }).count();
        const unassignedTicketCount = await Ticket.find({ projectId, assignees: [] }).count();
        const assignedTicketCount = ticketCount - unassignedTicketCount;
        const ticketStatusCount = await Ticket.aggregate([
            { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
            {
                $group: { _id: "$status", value: { $sum: 1 } }
            }
        ]);
        const ticketTypeCount = await Ticket.aggregate([
            { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
            {
                $group: {
                    _id: "$type",
                    value: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: "tickettypes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "ticketTypeInfo"
                }
            },
            {
                $project: {
                    ticketTypeInfo: { $arrayElemAt: ["$ticketTypeInfo", 0] },
                    value: 1,
                    _id: 0
                }
            }

        ]);

        return res.json({
            ticketCount,
            myTicketCount,
            assignedTicketCount,
            unassignedTicketCount,
            ticketStatusCount,
            ticketTypeCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};
