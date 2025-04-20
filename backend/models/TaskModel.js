const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    notistatus: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    }
})
const TaskModel = mongoose.model("taskdetails", TaskSchema)
module.exports = TaskModel;