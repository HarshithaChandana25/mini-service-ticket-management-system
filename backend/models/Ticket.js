const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            trim: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "Technical",
                "Billing",
                "Account",
                "Service",
                "General"
            ],
            default: "General"
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Open",
                "In Progress",
                "Resolved",
                "Closed"
            ],
            default: "Open"
        },

        comments: [
            {
                text: {
                    type: String,
                    trim: true
                },

                author: {
                    type: String,
                    default: "Support Team"
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        activity: [
            {
                action: {
                    type: String,
                    trim: true
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;