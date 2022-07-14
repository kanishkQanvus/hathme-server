const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    }
}, { timestamps: false })


module.exports = mongoose.model("admin", adminSchema)