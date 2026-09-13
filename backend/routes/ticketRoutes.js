const express = require("express");
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");

const router = express.Router();


// =====================================================
// GET ALL TICKETS
// Supports filtering and searching
// =====================================================

router.get("/", async (req, res) => {
    try {
        const {
            status,
            priority,
            customer,
            search
        } = req.query;

        const filter = {};

        // Filter by status
        if (status) {
            const validStatuses = [
                "Open",
                "In Progress",
                "Resolved",
                "Closed"
            ];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid status value"
                });
            }

            filter.status = status;
        }


        // Filter by priority
        if (priority) {
            const validPriorities = [
                "Low",
                "Medium",
                "High"
            ];

            if (!validPriorities.includes(priority)) {
                return res.status(400).json({
                    message: "Invalid priority value"
                });
            }

            filter.priority = priority;
        }


        // Filter by customer name
        if (customer) {
            filter.customerName = {
                $regex: customer,
                $options: "i"
            };
        }


        // Search by title OR customer name
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    customerName: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }


        const tickets = await Ticket
            .find(filter)
            .sort({ createdAt: -1 });


        res.status(200).json(tickets);

    } catch (error) {

        console.error(
            "GET tickets error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch tickets",
            error: error.message
        });
    }
});


// =====================================================
// GET SINGLE TICKET
// =====================================================

router.get("/:id", async (req, res) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message: "Invalid ticket ID"
            });
        }


        const ticket = await Ticket.findById(
            req.params.id
        );


        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        res.status(200).json(ticket);

    } catch (error) {

        console.error(
            "GET single ticket error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch ticket",
            error: error.message
        });
    }
});


// =====================================================
// CREATE TICKET
// =====================================================

router.post("/", async (req, res) => {
    try {

        const {
            customerName,
            title,
            description,
            category,
            priority
        } = req.body;


        // Required fields
        if (
            !customerName ||
            !customerName.trim() ||
            !title ||
            !title.trim() ||
            !description ||
            !description.trim()
        ) {
            return res.status(400).json({
                message:
                    "Customer name, title and description are required"
            });
        }


        // Validate priority
        const validPriorities = [
            "Low",
            "Medium",
            "High"
        ];

        if (
            priority !== undefined &&
            !validPriorities.includes(priority)
        ) {
            return res.status(400).json({
                message: "Invalid priority value"
            });
        }


        // Validate category
        const validCategories = [
            "Technical",
            "Billing",
            "Account",
            "Service",
            "General"
        ];

        if (
            category !== undefined &&
            !validCategories.includes(category)
        ) {
            return res.status(400).json({
                message: "Invalid category value"
            });
        }


        const ticket = new Ticket({
            customerName: customerName.trim(),

            title: title.trim(),

            description: description.trim(),

            category: category || "General",

            priority: priority || "Medium",

            status: "Open",

            activity: [
                {
                    action: "Ticket created"
                }
            ]
        });


        const savedTicket = await ticket.save();


        res.status(201).json(savedTicket);

    } catch (error) {

        console.error(
            "CREATE ticket error:",
            error
        );

        res.status(400).json({
            message: "Failed to create ticket",
            error: error.message
        });
    }
});


// =====================================================
// UPDATE TICKET
// =====================================================

router.put("/:id", async (req, res) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message: "Invalid ticket ID"
            });
        }


        const ticket = await Ticket.findById(
            req.params.id
        );


        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        const {
            customerName,
            title,
            description,
            category,
            priority,
            status
        } = req.body;


        // Validate customer name
        if (
            customerName !== undefined &&
            !customerName.trim()
        ) {
            return res.status(400).json({
                message: "Customer name cannot be empty"
            });
        }


        // Validate title
        if (
            title !== undefined &&
            !title.trim()
        ) {
            return res.status(400).json({
                message: "Title cannot be empty"
            });
        }


        // Validate description
        if (
            description !== undefined &&
            !description.trim()
        ) {
            return res.status(400).json({
                message: "Description cannot be empty"
            });
        }


        // Validate priority
        const validPriorities = [
            "Low",
            "Medium",
            "High"
        ];

        if (
            priority !== undefined &&
            !validPriorities.includes(priority)
        ) {
            return res.status(400).json({
                message: "Invalid priority value"
            });
        }


        // Validate status
        const validStatuses = [
            "Open",
            "In Progress",
            "Resolved",
            "Closed"
        ];

        if (
            status !== undefined &&
            !validStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }


        // Validate category
        const validCategories = [
            "Technical",
            "Billing",
            "Account",
            "Service",
            "General"
        ];

        if (
            category !== undefined &&
            !validCategories.includes(category)
        ) {
            return res.status(400).json({
                message: "Invalid category value"
            });
        }


        // Update fields

        if (customerName !== undefined) {
            ticket.customerName =
                customerName.trim();
        }


        if (title !== undefined) {
            ticket.title =
                title.trim();
        }


        if (description !== undefined) {
            ticket.description =
                description.trim();
        }


        if (category !== undefined) {
            ticket.category = category;
        }


        if (priority !== undefined) {
            ticket.priority = priority;
        }


        // Status update
        if (
            status !== undefined &&
            status !== ticket.status
        ) {

            ticket.activity.push({
                action:
                    `Status changed from ${ticket.status} to ${status}`
            });

            ticket.status = status;
        }


        const updatedTicket =
            await ticket.save();


        res.status(200).json(
            updatedTicket
        );

    } catch (error) {

        console.error(
            "UPDATE ticket error:",
            error
        );

        res.status(400).json({
            message: "Failed to update ticket",
            error: error.message
        });
    }
});


// =====================================================
// ADD COMMENT
// =====================================================

router.post("/:id/comments", async (req, res) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message: "Invalid ticket ID"
            });
        }


        const ticket = await Ticket.findById(
            req.params.id
        );


        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        const {
            text,
            author
        } = req.body;


        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }


        ticket.comments.push({
            text: text.trim(),
            author: author || "Support Team"
        });


        ticket.activity.push({
            action: "Comment added"
        });


        const updatedTicket =
            await ticket.save();


        res.status(201).json(
            updatedTicket
        );

    } catch (error) {

        console.error(
            "COMMENT error:",
            error
        );

        res.status(400).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
});


// =====================================================
// DELETE TICKET
// =====================================================

router.delete("/:id", async (req, res) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message: "Invalid ticket ID"
            });
        }


        const ticket =
            await Ticket.findByIdAndDelete(
                req.params.id
            );


        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        res.status(200).json({
            message:
                "Ticket deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE ticket error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete ticket",
            error: error.message
        });
    }
});


module.exports = router;