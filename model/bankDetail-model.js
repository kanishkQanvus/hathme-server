const mongoose = require("mongoose");
const bankDetailsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "userMasterModel"
    },
    name: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    ifsc: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("bankDetails", bankDetailsSchema);